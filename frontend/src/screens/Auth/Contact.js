import { useIsFocused } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { AlphabetList } from "react-native-section-alphabet-list";
import { createRoomChat } from "../../../services/chat.services";
import { deleteContact, getUserContacts } from "../../../services/contact.services";
import ContactItem from "../../components/Contact";
import RequestAddFriend from "../../components/Contact/RequestAddFriend";
import SectionHeader from "../../components/Contact/SectionHeader";
import SearchView from "../../components/SearchView";
import { useContextApp } from "../../ContextAPI";
import { WHITE_COLOR } from "../../shared/const";
import { checkConnected, isEmpty, nextScreen } from "../../shared/logic";
import { CHATROOM_VIEW } from "../../shared/views";

const Contact = ({navigation }) => {
  const isFocused = useIsFocused();
  const { searchInputFocus, userInfo, totalRequest, setIsLogin, setUserInfo, isLogin } = useContextApp();
  const [userContacts, setUserContacts] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    const getUC = async () => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      const res = await getUserContacts({ uid: userInfo?.id }, userInfo);
      if (res?.code === 1000) {
        setUserContacts(res?.data);
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
    };
    getUC();
  }, [userInfo, checkConnected, reload, isFocused, isLogin]);

  const hanldeRemoveContact = useCallback(
    (item) => {
      const removeCT = async () => {
        const isConnected = await checkConnected();
        if (!isConnected) {
          Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
            {
              text: "Đóng",
            },
          ]);
          return;
        }
        const res = await deleteContact({ uid: userInfo?.id, fid: item?.id }, userInfo);// xoá danh bạ
        if (res?.code === 1000) {
          setUserContacts((pre) => pre.filter((ct) => ct?.id !== item?.id)); // xoá khỏi danh bạ
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
      };
      Alert.alert(
        "Xóa bạn",
        `Bạn muốn xóa bạn với ${item?.fullname}?`,
        [
          {
            text: "Huỷ",
            style: "cancel",
          },
          {
            text: "Xoá",
            style: "destructive",
            onPress: () => removeCT(),
          },
        ],
        {
          style: {
            fontSize: 20,
          },
        }
      );
    },
    [userInfo, checkConnected]
  );

  const handleClick = useCallback(
    async (item) => {
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
      const res = await createRoomChat({ uid: userInfo?.id, fid: item?.id }, userInfo); // tạo một cuộc hội tho=ại
      setLoading(false);
      if (res?.code === 1000) {
        nextScreen(navigation, CHATROOM_VIEW, { roomChat: res?.data });
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
    },
    [userInfo, checkConnected, loading]
  );

  return (
    <View style={{ flex: 1, backgroundColor: WHITE_COLOR }}>
      {totalRequest > 0 && <RequestAddFriend navigation={navigation} />}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 14, textTransform: "uppercase", fontWeight: `500` }}>Danh bạ</Text>
      </View>
      <AlphabetList
        style={{
          flex: 1,
          paddingRight: 20,
        }}
        data={userContacts}
        listKey={(key) => key}
        renderCustomItem={(item) => {
          return (
            <ContactItem
              item={item}
              handleClick={handleClick}
              hanldeRemoveContact={hanldeRemoveContact}
              key={item?.id}
            />
          );
        }}
        renderCustomSectionHeader={(section) => {
          return <SectionHeader section={section} key={section.index} />;
        }}
        onEndReached={() => setReload((pre) => !pre)}
        onEndReachedThreshold={-0.5}
      />
      {searchInputFocus && <SearchView />}
    </View>
  );
};

export default Contact;
