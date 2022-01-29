import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { deleteRequest, getUserRequestAddFriend } from "../../../services/contact.services";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  PRIMARY_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import { checkConnected, formatPhoneNumber, getStrapiMedia, nextScreen } from "../../shared/logic";
import { FRIENDINFO_VIEW } from "../../shared/views";

const RequestAddFriend = ({ navigation }) => {
  const focus = useIsFocused();
  const { userInfo, isLogin, setIsLogin, setUserInfo } = useContextApp();
  const [loading, setLoading] = useState(true);
  const [listRequest, setListRequest] = useState([]);
  useEffect(() => {
    if (!isLogin) return;
    (async () => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      const rs = await getUserRequestAddFriend({ uid: userInfo?.id }, userInfo);
      setLoading(false);
      if (rs?.code === 1000) {
        setListRequest(rs?.data);
      } else if (rs?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setIsLogin(false);
        setUserInfo({});
        return;
      } else {
        Alert.alert("Không phản hồi", result?.msg, [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
    })();
  }, [userInfo, isLogin, focus]);

  const handleDelete = async (id) => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    const rs = await deleteRequest(id, userInfo);
    if (rs?.code === 1000) {
      const newData = listRequest.filter((item) => item?.id !== id);
      setListRequest(newData);
    } else if (rs?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    } else {
      Alert.alert("Không phản hồi", result?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {listRequest.length > 0 ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <FlatList
                  style={{ flex: 1 }}
                  data={listRequest}
                  keyExtractor={(item) => item?.id.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.container}>
                        <Pressable
                          onPress={() =>
                            nextScreen(navigation, FRIENDINFO_VIEW, {
                              userId: item?.reciverUser?.id,
                            })
                          }
                        >
                          {item?.reciverUser?.avatar ? (
                            <Image
                              source={{
                                uri: getStrapiMedia(item?.reciverUser?.avatar),
                              }}
                              style={styles.image}
                            />
                          ) : (
                            <View style={{ ...styles.image }} />
                          )}
                        </Pressable>
                        <View
                          style={[
                            styles.rightComponent,
                            { borderBottomWidth: index === listRequest?.length - 1 ? 0 : 0.5 },
                          ]}
                        >
                          <View style={styles.row}>
                            <Text style={styles.name} numberOfLines={1}>
                              {item?.reciverUser?.fullname}
                            </Text>
                            <Text style={styles.text} numberOfLines={1}>
                              Số điện thoại:{" "}
                              <Text style={{ color: PRIMARY_COLOR }}>
                                {formatPhoneNumber(item?.reciverUser?.phonenumber)}
                              </Text>
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => handleDelete(item?.id)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.deleteView}>
                              <Text style={styles.deleteStyle}>Huỷ</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: `center`, alignItems: `center` }}>
              <Text>Bạn chưa gửi lời mời kết bạn nào</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE_COLOR,
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: `#808080`,
  },
  rightComponent: {
    flex: 1,
    flexDirection: `row`,
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingTop: 20,
    marginLeft: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingRight: 20,
  },
  name: {
    fontSize: 17,
    fontWeight: "400",
  },
  text: {
    fontSize: 14,
    color: TEXT_GRAY_COLOR,
  },
  deleteView: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  deleteStyle: {
    borderWidth: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    borderColor: BORDER_BOTTOM_COLOR,
    color: `#ffffff`,
    overflow: `hidden`,
  },
});

export default RequestAddFriend;
