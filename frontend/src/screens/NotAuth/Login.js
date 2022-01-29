import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { login } from "../../../services/user.services";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyboard from "../../components/DismissKeyBoard";
import Footer from "../../components/LoginView/Footer";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import { useContextApp } from "../../ContextAPI";
import {
  BLACK_COLOR,
  BORDER_BOTTOM_COLOR,
  FOCUS_COLOR,
  PRIMARY_COLOR,
  WARNING_COLOR,
} from "../../shared/const";
import {
  checkConnected,
  formatPhoneNumber,
  isVietnamesePhoneNumber,
  nextScreen,
} from "../../shared/logic";
import { FORGOTPASSWORD_VIEW, REGISTER_VIEW } from "../../shared/views";

const Login = ({ route, navigation }) => {
  const { phonenumber } = route.params;
  const { setIsLogin, setUserInfo } = useContextApp();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  const [passwordFocus, setPassWordFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phonenumber) {
      setPhoneNumber(phonenumber);
    }
  }, [phonenumber]);

  const logIn = useCallback(async () => { // Xử lý đăng nhập
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
      setErrorSMS("Số điện thoại không hợp lệ");
      setError(true);
      return;
    }
    const data = {
      phonenumber: phoneNumber,
      password: password,
    };
    setLoading(true);
    const res = await login(data); // gọi đên api login
    setLoading(false);
    if (res?.code === 1000) { // thành công
      setIsLogin(true); // đăng nhập = true
      setUserInfo(res?.data); // thông tin người dùng
      return;
    }
    if (res?.code === 1004) { // trường dữ liệu k đúng
      setError(true);
      setErrorSMS(res?.msg);
      return;
    }
    if (res?.code === 9995) { // người dùng k tổn tại
      Alert.alert(formatPhoneNumber(phoneNumber), res?.msg, [
        {
          text: "Để sau",
          style: "default",
        },
        {
          text: "Tạo tài khoản",
          onPress: () => nextScreen(navigation, REGISTER_VIEW, { phoneNumber }),
        },
      ]);
      return;
    }
    if (res?.code === 503) { // Lỗi serverr
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  }, [
    isVietnamesePhoneNumber,
    checkConnected,
    phoneNumber,
    password,
    formatPhoneNumber,
    nextScreen,
  ]);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <DescriptionScreens text={`Bạn có thể đăng nhập bằng số điện thoại`} />
          <View style={{ padding: 10, marginTop: 10 }}>
            <CustomTextInput
              viewStyle={{ marginBottom: 2, position: "relative", justifyContent: "center" }}
              placeholder="Số điện thoại"
              keyboardType="numeric"
              onChangeText={(value) => {
                setPhoneNumber(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
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
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 5,
                  alignItems: "center",
                }}
              >
                {phoneNumberFocus && phoneNumber.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setPhoneNumber("")}
                  />
                )}
              </View>
            </CustomTextInput>

            <CustomTextInput
              viewStyle={{ positon: "relative", justifyContent: "center" }}
              placeholder="Mật khẩu"
              isHide={hidePass}
              onChangeText={(value) => {
                setPassword(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingBottom: passwordFocus ? 11 : 12,
                paddingRight: 60,
                borderBottomWidth: passwordFocus ? 2 : 1,
                borderBottomColor: passwordFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setPassWordFocus(true)}
              onBlur={() => setPassWordFocus(false)}
              inputValue={password}
            >
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 60,
                  alignItems: "center",
                }}
              >
                {passwordFocus && password.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setPassword("")}
                  />
                )}
                {hidePass ? (
                  <Icon
                    name="eye-outline"
                    color="gray"
                    size={25}
                    style={{ position: "absolute", right: 0 }}
                    onPress={() => setHidePass(false)}
                  />
                ) : (
                  <Icon
                    name="eye-off-outline"
                    color="gray"
                    size={25}
                    style={{ position: "absolute", right: 0 }}
                    onPress={() => setHidePass(true)}
                  />
                )}
              </View>
            </CustomTextInput>
            {error && (
              <View style={{ marginTop: 15 }}>
                <Text style={{ color: WARNING_COLOR, fontSize: 15 }}>{errorSMS}</Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ marginBottom: 15, marginTop: 15 }}
              onPress={() => nextScreen(navigation, FORGOTPASSWORD_VIEW)}
            >
              <Text style={{ color: PRIMARY_COLOR, fontSize: 16, fontWeight: "500" }}>
                Lấy lại mật khẩu
              </Text>
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <CustomButton
                title={`Đăng nhập`}
                width={200}
                disabled={phoneNumber === "" || password === "" || loading}
                handlePress={() => logIn()}
                padding={12}
              />
            </View>
          </View>
        </View>
        <Footer />
      </View>
    </DismissKeyboard>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    width: 180,
  },
  inputContain: {
    marginBottom: 15,
    borderBottomColor: "grey",
    paddingBottom: 5,
    borderBottomWidth: 1,
    flexDirection: "row",
  },
});

export default memo(Login);
