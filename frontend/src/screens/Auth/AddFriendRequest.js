import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import { TEXT_GRAY_COLOR, WHITE_COLOR } from "../../shared/const";
import Icon from "react-native-vector-icons/Ionicons";
import { checkConnected, getStrapiMedia, isEmpty, nextScreen } from "../../shared/logic";
import {
  acceptRequest,
  deleteRequest,
  getRequestAddFriend,
} from "../../../services/contact.services";
import { useContextApp } from "../../ContextAPI";
import { FRIENDINFO_VIEW } from "../../shared/views";
import { useIsFocused } from "@react-navigation/native";

const AddFriendRequest = ({ navigation }) => {
  const focus = useIsFocused();
  const { userInfo, setTotalRequest, setIsLogin, setUserInfo } = useContextApp();
  const [rqAddFriend, setRqAddFriend] = useState([]);

  useEffect(() => {
    if (isEmpty(userInfo)) return;
    const getRQAF = async () => {
      const rs = await getRequestAddFriend({ uid: userInfo?.id }, userInfo);
      if (rs?.code === 1000) {
        setRqAddFriend(rs?.data || []);
      }
    };
    getRQAF();
  }, [userInfo, focus]);

  const hanldeRemove = useCallback(
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
      const res = await deleteRequest(item?.id, userInfo);
      if (res?.code === 1000) {
        setTotalRequest((pre) => pre - 1);
        setRqAddFriend((pre) => pre.filter((rq) => rq?.id !== item?.id));
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
    [checkConnected, userInfo]
  );

  const hanldeAccept = useCallback(
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
      const res = await acceptRequest(
        { uid: item?.senderId, fid: item?.reciverId, rId: item?.id },
        userInfo
      );
      if (res?.code === 1000) {
        setTotalRequest((pre) => pre - 1);
        setRqAddFriend((pre) => pre.filter((rq) => rq?.id !== item?.id));
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
    [userInfo, checkConnected]
  );
  return (
    <View style={{ flex: 1, backgroundColor: WHITE_COLOR }}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          flex: 1,
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={rqAddFriend}
          keyExtractor={(item) => item?.id.toString()}
          renderItem={({ item }) => {
            return (
              <Pressable style={styles.container}>
                <Pressable
                  onPress={() =>
                    nextScreen(navigation, FRIENDINFO_VIEW, { userId: item?.senderId })
                  }
                >
                  {item?.senderUser?.avatar ? (
                    <Image
                      source={{
                        uri: getStrapiMedia(item?.senderUser?.avatar),
                      }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={{ ...styles.image, backgroundColor: `#808080` }} />
                  )}
                </Pressable>
                <View style={styles.rightComponent}>
                  <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>
                      {item?.senderUser?.fullname}
                    </Text>
                  </View>
                  <View style={styles.message}>
                    <Text>Tìm kiếm từ số điện thoại</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 5,
                  }}
                >
                  <CustomButton
                    title={`Đồng ý`}
                    width={80}
                    padding={5}
                    handlePress={() => hanldeAccept(item)}
                  />
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={25}
                    style={{ marginLeft: 10 }}
                    onPress={() => hanldeRemove(item)}
                  />
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#b8bbbf",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  rightComponent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },
  name: {
    fontSize: 17,
    flex: 1,
    fontWeight: "400",
  },
  text: {
    fontSize: 14,
    color: TEXT_GRAY_COLOR,
  },
  message: {},
});

export default AddFriendRequest;
