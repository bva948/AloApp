import { useIsFocused } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import {
  getMessages,
  sendMessage,
  setMessageUnRead,
  setUnRead,
  upLoadImage,
} from "../../../services/chat.services";
import { getIsFriend } from "../../../services/contact.services";
import MessageComponent from "../../components/Chat/MessageComponent";
import MessageInput from "../../components/Chat/MessageInput";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import { checkConnected, isEmpty, nextScreen } from "../../shared/logic";

const ChatRoom = ({ route, navigation }) => {
  const roomChat = route.params.roomChat;
  const flatListMessage = useRef();
  const { userInfo, setIsLogin, setUserInfo, socket, setTotalMessageUnRead } = useContextApp();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState({});
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isFriend, setIsFriend] = useState();

  useEffect(() => {
    // hàm lắng nghe sự kiện nhận tin nhắn từ socket
    const getNewMessage = async (message) => {
      if (!isEmpty(message) && roomChat?.members?.includes(parseInt(message?.senderId))) {
        // check điều kiện
        setDatas((pre) => {
          const {
            pagination: { page, pageSize },
            lData,
          } = pre;
          if (lData?.length < page * pageSize) {
            return { ...pre, lData: [message, ...lData] };
          }
          const newData = lData?.slice(0, page * pageSize - 1);
          return {
            ...pre,
            lData: [message, ...newData],
            pagination: { ...pre?.pagination, hasMore: true },
          };
        }); // nối dữ liệu cũ với tin nhắn nhận đc
        if (parseInt(message?.senderId, 10) !== userInfo?.id && message?.unRead === true) {
          const rs = await setMessageUnRead({ mId: message?.id }, userInfo);
        }
        flatListMessage?.current?.scrollToOffset({ animated: true, offset: 0 }); // cuộn về tin nhắn mới nhất
      }
    };
    socket.current.on(`getMessage`, getNewMessage);
    return async () => await socket?.current?.off(`getMessage`, getNewMessage); // xoá sự kiện
  }, [roomChat?.members, socket, flatListMessage, userInfo]);

  useEffect(() => {
    // Set tên trên Header
    navigation.setOptions({ title: roomChat?.reciveUser?.fullname || "No name" });
  }, [roomChat]);

  useEffect(() => {
    // Lấy danh sách tin nhắn.
    getData();
  }, [getData]);

  const getData = useCallback(async () => {
    if (loading) return;
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    setLoading(true);
    const [res, rs1] = await Promise.all([
      getMessages(
        {
          roomchatId: roomChat?.id,
        },
        userInfo
      ),
      getIsFriend({ uid: userInfo?.id, fid: roomChat?.reciveUser?.id }),
    ]);
    setIsFriend(rs1?.data);
    setLoading(false);
    if (res?.code === 1000) {
      setDatas(res?.data);
      if (roomChat?.totalUnRead > 0) {
        await setUnRead({ roomchatId: roomChat?.id, uid: userInfo?.id }, userInfo);
        setTotalMessageUnRead((pre) => pre - roomChat?.totalUnRead);
      }
      return;
    } else if (res?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản đã hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    } else {
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  }, [checkConnected, nextScreen, navigation, roomChat, userInfo, socket]);

  const handleSend = useCallback(
    async (content, cb1, cb2) => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      const data = {
        content,
        senderId: userInfo?.id,
        roomchatId: roomChat?.id,
      };
      cb2(true);
      const res = await sendMessage(data, userInfo);
      cb2(false);
      cb1();
      if (res?.code === 1000) {
        setDatas((pre) => {
          const {
            pagination: { page, pageSize },
            lData,
          } = pre;
          if (lData?.length < page * pageSize) {
            return { ...pre, lData: [res?.data, ...pre?.lData] };
          }
          const newData = lData?.slice(0, page * pageSize - 1);
          return {
            ...pre,
            lData: [res?.data, ...newData],
            pagination: { ...pre?.pagination, hasMore: true },
          };
        });
        realTimeChat(res?.data);
        flatListMessage.current.scrollToOffset({ animated: true, offset: 0 });
        return;
      } else if (res?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản đã hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setIsLogin(false);
        setUserInfo({});
        return;
      } else {
        Alert.alert("Không phản hồi", res?.msg, [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
    },
    [userInfo, roomChat?.id, sendMessage, checkConnected, realTimeChat, flatListMessage]
  );

  const hanldeSendImage = useCallback(
    async (data, cb1, cb2) => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      cb2(true);
      const rs = await upLoadImage(data); // gửi ảnh lên server
      if (rs instanceof Array) {
        // ảnh gửi thành công
        cb1(); // xoá ảnh khỏi biến khi thành công
        const dataM = {
          // tạo tin tin nhắn chứa đường dẫn ảnh trên server
          content: null,
          senderId: userInfo?.id,
          roomchatId: roomChat?.id,
          image: rs?.[0]?.url,
        };
        const res = await sendMessage(dataM, userInfo); // gọi api tạo tin nhắn
        cb2(false);
        if (res?.code === 1000) {
          setDatas((pre) => {
            const {
              pagination: { page, pageSize },
              lData,
            } = pre;
            if (lData?.length < page * pageSize) {
              return { ...pre, lData: [res?.data, ...pre?.lData] };
            }
            const newData = lData?.slice(0, page * pageSize - 1);
            return {
              ...pre,
              lData: [res?.data, ...newData],
              pagination: { ...pre?.pagination, hasMore: true },
            };
          });
          realTimeChat(res?.data);
          flatListMessage.current.scrollToOffset({ animated: true, offset: 0 });
        } else if (res?.code === 9998) {
          Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
            {
              text: "Đóng",
            },
          ]);
          setIsLogin(false);
          setUserInfo({});
        } else {
          Alert.alert("Không phản hồi", res?.msg, [
            {
              text: "Đóng",
            },
          ]);
        }
        return;
      }
      cb1();
      cb2(false);
      Alert.alert("Không phản hồi", `Có lỗi xảy ra.Vui lòng thử lại sau.`, [
        {
          text: "Đóng",
        },
      ]);
    },
    [checkConnected, userInfo?.id, roomChat?.id, realTimeChat, flatListMessage]
  );

  const realTimeChat = useCallback(
    (message) => {
      socket.current.emit(`sendMessage`, {
        data: message,
        reciverId: parseInt(roomChat?.reciveUser?.id, 10),
      });
    },
    [socket, roomChat]
  );

  const loadMore = useCallback(async () => {
    // tải thêm nếu còn
    if (datas?.pagination?.hasMore && !isLoadMore) {
      setIsLoadMore(true);
      const res = await getMessages(
        {
          roomchatId: roomChat?.id,
          page: datas?.pagination?.page + 1,
        },
        userInfo
      );
      setIsLoadMore(false);
      if (res?.code === 1000) {
        setDatas((pre) => ({
          pagination: res?.data?.pagination,
          lData: pre?.lData?.concat(res?.data?.lData),
        }));
        return;
      }
      if (res?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản đã hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setIsLogin(false);
        setUserInfo({});
        return;
      }
    }
  }, [datas, userInfo, socket, isLoadMore]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <MessageComponent
            messages={datas?.lData || []}
            reciveUser={roomChat?.reciveUser}
            flatListMessage={flatListMessage}
            loadMore={loadMore}
            isLoadMore={isLoadMore}
            navigation={navigation}
          />
          <MessageInput
            handleSend={handleSend}
            hanldeSendImage={hanldeSendImage}
            isFriend={isFriend?.isFriend}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default memo(ChatRoom);
