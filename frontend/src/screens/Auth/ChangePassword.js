import React, { useCallback, useState } from "react";
import { Alert, Text, View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyBoard from "../../components/DismissKeyBoard";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, FOCUS_COLOR, WARNING_COLOR } from "../../shared/const";
import Icon from "react-native-vector-icons/Ionicons";
import { useContextApp } from "../../ContextAPI";
import { checkConnected, checkPassword, nextScreen } from "../../shared/logic";
import { changePassword } from "../../../services/user.services";

const ChangePassword = () => {
  const { userInfo, setUserInfo, setIsLogin } = useContextApp();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [passwordFocus, setPassWordFocus] = useState(false);
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
    if (newPassword === oldPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới của bạn đang trùng với mật khẩu cũ.", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }

    if (confirmPassword !== newPassword) {
      setError(true);
      setErrorSMS(`Xác nhận mật khẩu không chính xác, vui lòng thử lại.`);
      return;
    }
    const data = {
      uid: userInfo?.id,
      oldPassword,
      newPassword,
    };
    const rs = await changePassword(data);
    if (rs?.code === 9995) {
      Alert.alert("Lỗi", "Mật khẩu không chính xác. Vui lòng nhập đúng mật khẩu cũ.", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    Alert.alert("Đổi mật khẩu thành công", "Mật khẩu đã được thay đổi vui lòng đăng nhập lại.", [
      {
        text: "Đăng xuất",
        onPress: () => {
          setIsLogin(false);
          setUserInfo({});
        },
      },
    ]);
  }, [userInfo, oldPassword, newPassword, confirmPassword]);

  return (
    <DismissKeyBoard>
      <View style={{ flex: 1 }}>
        <View>
          <View style={{ padding: 10, marginTop: 10 }}>
            <CustomTextInput
              viewStyle={{ positon: "relative", justifyContent: "center" }}
              placeholder="Nhập mật khẩu cũ"
              isHide={hidePass}
              textInputStyle={{
                paddingTop: 12,
                paddingBottom: passwordFocus ? 11 : 12,
                paddingRight: 60,
                borderBottomWidth: passwordFocus ? 2 : 1,
                borderBottomColor: passwordFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onChangeText={(value) => {
                setOldPassword(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              onFocus={() => setPassWordFocus(true)}
              onBlur={() => setPassWordFocus(false)}
              inputValue={oldPassword}
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
                {passwordFocus && oldPassword.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setOldPassword("")}
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
                  justifyContent: "center",
                  width: 30,
                  padding: 5,
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
              </View>
            </CustomTextInput>
            <CustomTextInput
              viewStyle={{ positon: "relative", justifyContent: "center" }}
              placeholder="Xác nhận mật khẩu mới"
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
                title={`Đổi mật khẩu`}
                width={200}
                disabled={
                  confirmPassword === "" || oldPassword === "" || newPassword === "" || loading
                }
                handlePress={handleChangePassword}
                padding={12}
              />
            </View>
          </View>
        </View>
      </View>
    </DismissKeyBoard>
  );
};

export default ChangePassword;
