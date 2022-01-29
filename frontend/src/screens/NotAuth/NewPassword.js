import React, { memo, useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { forgotPassword } from "../../../services/user.services";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyboard from "../../components/DismissKeyBoard";
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
import { HOME_VIEW } from "../../shared/views";

const NewPassword = ({ route, navigation }) => {
  const { phonenumber } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [confirmNewPasswordFocus, setConfirmNewPasswordFocus] = useState(false);
  const [newPasswordFocus, setNewPassWordFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = useCallback(async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    if (!checkPassword(newPassword)) {
      setError(true);
      setErrorSMS(
        `Mật khẩu không hợp lệ. Mật khẩu hợp lệ phải gồm 6-30 ký tự, chứa ít nhất một chữ hoa, một chữ thường, một chữ số.`
      );
      return;
    }
    if (confirmNewPassword !== newPassword) {
      setError(true);
      setErrorSMS(`Xác nhận mật khẩu không chính xác, vui lòng thử lại.`);
      return;
    }
    const data = {
      phonenumber,
      newpassword: newPassword,
    };
    setLoading(true);
    const res = await forgotPassword(data);
    setLoading(false);
    if (res?.code === 1000) {
      Alert.alert("Thành công");
      nextScreen(navigation, HOME_VIEW);
      return;
    }
    if (res?.code === 9995) {
      Alert.alert(formatPhoneNumber(phonenumber), res?.msg, [
        {
          text: "Đóng",
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
    confirmNewPassword,
    newPassword,
    checkConnected,
    checkPassword,
    phonenumber,
    navigation,
    nextScreen,
  ]);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View>
          <DescriptionScreens text={`Thiết lập mật khẩu mới`} />
          <View style={{ padding: 10, marginTop: 10 }}>
            <CustomTextInput
              viewStyle={{ positon: "relative", justifyContent: "center" }}
              placeholder="Mật khẩu mới"
              isHide={hidePass}
              onChangeText={(value) => {
                setNewPassword(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingBottom: newPasswordFocus ? 11 : 12,
                paddingRight: 60,
                borderBottomWidth: newPasswordFocus ? 2 : 1,
                borderBottomColor: newPasswordFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setNewPassWordFocus(true)}
              onBlur={() => setNewPassWordFocus(false)}
              inputValue={newPassword}
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
                {newPasswordFocus && newPassword.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setNewPassword("")}
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
              placeholder="Xác nhận mật khẩu mới"
              isHide={hidePass}
              onChangeText={(value) => {
                setConfirmNewPassword(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingBottom: confirmNewPassword ? 11 : 12,
                paddingRight: 60,
                borderBottomWidth: confirmNewPassword ? 2 : 1,
                borderBottomColor: confirmNewPassword ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setConfirmNewPasswordFocus(true)}
              onBlur={() => setConfirmNewPasswordFocus(false)}
              inputValue={confirmNewPassword}
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
                {confirmNewPasswordFocus && confirmNewPassword.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setConfirmNewPassword("")}
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
                title={`Áp dụng`}
                width={200}
                disabled={confirmNewPassword === "" || newPassword === "" || loading}
                handlePress={() => handleChangePassword()}
                padding={12}
              />
            </View>
          </View>
        </View>
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

export default memo(NewPassword);
