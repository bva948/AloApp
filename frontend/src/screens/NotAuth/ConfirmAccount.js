import React, { memo, useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { register } from "../../../services/user.services";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyboard from "../../components/DismissKeyBoard";
import Footer from "../../components/LoginView/Footer";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import {
  BLACK_COLOR,
  BORDER_BOTTOM_COLOR,
  FOCUS_COLOR,
  PRIMARY_COLOR,
  WARNING_COLOR,
} from "../../shared/const";
import {
  checkConnected,
  checkPassword,
  formatPhoneNumber,
  isVietnamesePhoneNumber,
  nextScreen,
} from "../../shared/logic";
import { HOME_VIEW, LOGIN_VIEW } from "../../shared/views";

const ConfirmAccount = ({ route, navigation }) => {
  const { fullname, phonenumber } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [passwordFocus, setPassWordFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = useCallback(async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    if (!checkPassword(password)) {
      setError(true);
      setErrorSMS(
        `Mật khẩu không hợp lệ. Mật khẩu hợp lệ phải gồm 6-30 ký tự, chứa ít nhất một chữ hoa, một chữ thường, một chữ số.`
      );
      return;
    }
    if (confirmPassword !== password) {
      setError(true);
      setErrorSMS(`Xác nhận mật khẩu không chính xác, vui lòng thử lại.`);
      return;
    }
    const data = {
      fullname,
      phonenumber,
      password,
    };
    setLoading(true);
    const res = await register(data); // gọi api đăng kí tài khoản
    setLoading(false);
    if (res?.code === 1000) {
      Alert.alert("Đăng ký thành công");
      nextScreen(navigation, LOGIN_VIEW, { phonenumber, password });
      return;
    }
    if (res?.code === 9996) {
      // dự phòng người dùng tồn tại
      Alert.alert(formatPhoneNumber(phonenumber), res?.msg, [
        {
          text: "Để sau",
          onPress: () => nextScreen(navigation, HOME_VIEW),
        },
        {
          text: "Đăng nhập",
          onPress: () => nextScreen(navigation, LOGIN_VIEW, { phonenumber }),
        },
      ]);
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
  }, [
    isVietnamesePhoneNumber,
    confirmPassword,
    password,
    checkConnected,
    checkPassword,
    formatPhoneNumber,
  ]);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <DescriptionScreens text={`Thiết lập mật khẩu giúp cho tài khoản của bạn an toàn hơn`} />
          <View style={{ padding: 10, marginTop: 10 }}>
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
            <CustomTextInput
              viewStyle={{ positon: "relative", justifyContent: "center" }}
              placeholder="Xác nhận mật khẩu"
              isHide={hidePass}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingBottom: confirmPasswordFocus ? 11 : 12,
                paddingRight: 60,
                borderBottomWidth: confirmPasswordFocus ? 2 : 1,
                borderBottomColor: confirmPasswordFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setConfirmPasswordFocus(true)}
              onBlur={() => setConfirmPasswordFocus(false)}
              inputValue={confirmPassword}
            >
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  width: 30,
                  padding: 5,
                  alignItems: "center",
                }}
              >
                {confirmPasswordFocus && confirmPassword.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setConfirmPassword("")}
                  />
                )}
              </View>
            </CustomTextInput>

            {error && (
              <View style={{ marginTop: 15 }}>
                <Text style={{ color: WARNING_COLOR, fontSize: 15 }}>{errorSMS}</Text>
              </View>
            )}
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <CustomButton
                title={`Tạo tài khoản`}
                width={200}
                disabled={confirmPassword === "" || password === "" || loading}
                handlePress={() => handleCreateAccount()}
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

export default memo(ConfirmAccount);
