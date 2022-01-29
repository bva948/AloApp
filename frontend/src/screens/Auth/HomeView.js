import { useIsFocused } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { deleteRoomChat, getRoomChats } from "../../../services/chat.services";
import RoomChat from "../../components/Chat/RoomChat";
import DismissKeyboard from "../../components/DismissKeyBoard";
import SearchView from "../../components/SearchView";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import { checkConnected, isEmpty } from "../../shared/logic";

const HomeView = ({ route, navigation }) => {
  const {
    searchInputFocus,
    userInfo,
    setIsLogin,
    setUserInfo,
    socket,
    setTotalMessageUnRead,
    isLogin,
  } = useContextApp();
  const isFocused = useIsFocused();
  const [roomChats, setRoomChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReaload, setIsReaload] = useState(false);

  useEffect(() => {
    socket.current?.on(`getMessage`, (message) => {
      if (!isEmpty(message)) {
        getUsersRoomChat();
      }
    });
    return async () => {
      await socket?.current?.off(`getMessage`);
    };
  }, [getUsersRoomChat]);

  useEffect(() => {
    const totalUnRead = roomChats.reduce((total, rc) => total + rc?.totalUnRead, 0);
    setTotalMessageUnRead(totalUnRead);
  }, [roomChats]);

  useEffect(() => {
    if (route?.name !== `Tin nhắn`) return;
    getUsersRoomChat();
  }, [getUsersRoomChat, isFocused, isReaload, route]);

  const getUsersRoomChat = useCallback(async () => {
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      setLoading(false);
      return;
    }
    const rs = await getRoomChats({ uid: userInfo?.id }, userInfo);
    setLoading(false);
    if (rs?.code === 1000) {
      setRoomChats(rs?.data?.lData);
      return;
    }
    if (rs?.code === 503) {
      Alert.alert("Không phản hồi", rs?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    if (rs?.code === 1004) {
      Alert.alert("Dữ liệu không hợp lệ", rs?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    if (rs?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    }
  }, [userInfo, setIsLogin, setUserInfo, checkConnected, socket, getRoomChats, isLogin]);

  const handleRemove = useCallback(
    async (item) => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      Alert.alert(`Xoá tin nhắn`, `Bạn thực sự muốn xoá tin nhắn này?`, [
        {
          text: `Huỷ`,
        },
        {
          text: `Xoá`,
          onPress: async () => {
            const res = await deleteRoomChat({ roomchatId: item?.id }, userInfo);
            if (res?.code === 1000) {
              setIsReaload((pre) => !pre);
            }
          },
        },
      ]);
    },
    [userInfo, checkConnected]
  );

  return (
    <>
      {searchInputFocus && <SearchView />}
      {loading ? (
        <Spinner />
      ) : (
        <DismissKeyboard>
          {roomChats.length > 0 ? (
            <FlatList
              data={roomChats}
              renderItem={({ item, index }) => (
                <RoomChat
                  roomChat={item}
                  isLastItem={index === roomChats.length - 1}
                  lastMessageIsMe={parseInt(item?.lastMessage?.senderId) === userInfo?.id}
                  navigation={navigation}
                  handleRemove={handleRemove}
                  key={item?.id}
                  setIsReload={setIsReaload}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={() => setIsReaload((pre) => !pre)} />
              }
              keyExtractor={(item, index) => index.toString()}
              style={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1, alignItems: `center`, justifyContent: `center`, padding: 10 }}>
              <Text>Bạn chưa có tin nhắn nào</Text>
            </View>
          )}
        </DismissKeyboard>
      )}
    </>
  );
};

export default memo(HomeView);
