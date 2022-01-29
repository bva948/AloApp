import { useIsFocused } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  acceptRequest,
  deleteRequest,
  findUserByPhone,
  requestAddFriend,
} from "../../../services/contact.services";
import Friend from "../../components/Contact/Friend";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyBoard from "../../components/DismissKeyBoard";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import { useContextApp } from "../../ContextAPI";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, FOCUS_COLOR, WHITE_COLOR } from "../../shared/const";
import {
  checkConnected,
  formatPhoneNumber,
  isEmpty,
  isVietnamesePhoneNumber,
} from "../../shared/logic";

const AddFriend = ({ navigation }) => {
  const focus = useIsFocused();
  const { userInfo, setIsLogin, setUserInfo, setTotalRequest, socket, isLogin } = useContextApp();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("");
  const [loading, setLoading] = useState(false);
  const [friend, setFriend] = useState({});

  const animation = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-10),
    }),
    []
  );

  useEffect(() => {
    setFriend({});
  }, [focus]);

  useEffect(() => {
    if (error) {
      Animated.parallel([
        Animated.timing(animation.opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation.translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error, animation]);

  const handleAddFriend = useCallback(async () => {
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
      senderId: userInfo?.id,
      reciverId: friend?.id,
      message: "test",
    };
    const res = await requestAddFriend(data, userInfo);
    if (res?.code === 1000) {
      setFriend((pre) => ({
        ...pre,
        showBtn: false,
        isRQAF: `Đã gửi yêu cầu kết bạn`,
        waitting: true,
        rId: res?.data?.id,
      }));
      realTimeRQAF(res?.data);
      return;
    }
    if (res?.code === 503) {
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  }, [requestAddFriend, friend, userInfo, checkConnected]);

  const handleFindFriend = useCallback(async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    if (!isVietnamesePhoneNumber(phoneNumber)) {
      setErrorSMS("Số điện thoại không hợp lệ.");
      setError(true);
      return;
    }
    setLoading(true);
    const res = await findUserByPhone({ uid: userInfo?.id, phonenumber: phoneNumber }, userInfo);
    setLoading(false);
    if (res?.code === 1000) {
      if (isEmpty(res?.data)) {
        Alert.alert(formatPhoneNumber(phoneNumber), res?.msg, [
          {
            text: "Đóng",
          },
        ]);
        return;
      } else {
        setFriend(res?.data);
      }
      return;
    }
    if (res?.code === 503) {
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  }, [phoneNumber, checkConnected, navigation, userInfo, realTimeRQAF]);

  const realTimeRQAF = useCallback(
    (data) => {
      if (!isEmpty(data)) {
        socket.current.emit(`sendRQAF`, data);
      }
    },
    [socket?.current]
  );

  const handleAccept = useCallback(async () => {
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
      { uid: userInfo?.id, fid: friend?.id, rId: friend?.rId },
      userInfo
    );
    if (res?.code === 1000) {
      setTotalRequest((pre) => pre - 1);
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
  }, [checkConnected, userInfo, friend]);

  const handleDelete = async (id) => {
    if (!isLogin) return;
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
      setFriend((pre) => ({ ...pre, showBtn: true, isRQAF: false, waitting: false }));
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
    <DismissKeyBoard>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View
          style={{
            backgroundColor: WHITE_COLOR,
          }}
        >
          <DescriptionScreens text={`Thêm bạn bằng số điện thoại`} bgColor={WHITE_COLOR} />
          <View style={{ padding: 10 }}>
            <CustomTextInput
              viewStyle={styles.inputContainer}
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
              onChangeText={(value) => {
                setPhoneNumber(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
                if (!isEmpty(friend)) {
                  setFriend({});
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingRight: 40,
                paddingBottom: phoneNumberFocus ? 11 : 12,
                borderBottomWidth: phoneNumberFocus ? 2 : 1,
                borderBottomColor: phoneNumberFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setPhoneNumberFocus(true)}
              onBlur={() => setPhoneNumberFocus(false)}
              inputValue={phoneNumber}
            >
              <View style={styles.iconContainer}>
                {phoneNumberFocus && phoneNumber.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => {
                      setPhoneNumber("");
                      setFriend({});
                    }}
                  />
                )}
              </View>
            </CustomTextInput>
            {error && (
              <Animated.Text
                style={{
                  marginTop: 15,
                  color: "#dc3545",
                  fontSize: 15,
                  transform: [{ translateY: animation.translateY }],
                  opacity: animation.opacity,
                }}
              >
                {errorSMS}
              </Animated.Text>
            )}
          </View>
          <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
            <CustomButton
              title={`Tìm`}
              width={200}
              disabled={phoneNumber === "" || loading}
              handlePress={handleFindFriend}
              padding={12}
            />
          </View>
        </View>
        {!isEmpty(friend) && (
          <Friend
            friend={friend}
            handleAddFriend={handleAddFriend}
            handleAccept={handleAccept}
            handleDelete={handleDelete}
            navigation={navigation}
          />
        )}
      </View>
    </DismissKeyBoard>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 2,
    position: "relative",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    padding: 5,
    alignItems: "center",
  },
});

export default memo(AddFriend);
