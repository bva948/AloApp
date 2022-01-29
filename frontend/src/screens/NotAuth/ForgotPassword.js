import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Animated, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { findByPhone } from "../../../services/user.services";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyboard from "../../components/DismissKeyBoard";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, FOCUS_COLOR } from "../../shared/const";
import {
  checkConnected,
  formatPhoneNumber,
  isEmpty,
  isVietnamesePhoneNumber,
  nextScreen,
} from "../../shared/logic";
import { NEWPASSWORD_VIEW } from "../../shared/views";

const ForgotPassword = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("Loi");
  const [loading, setLoading] = useState(false);

  const animation = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-10),
    }),
    []
  );

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

  const handleNext = useCallback(async () => {
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
    const res = await findByPhone({ phonenumber: phoneNumber });
    setLoading(false);
    if (res?.code === 1000) {
      if (isEmpty(res?.data)) {
        Alert.alert(
          formatPhoneNumber(phoneNumber),
          `Số điện thoại chưa được sử dụng, vui lòng thử lại.`,
          [
            {
              text: "Đóng",
            },
          ]
        );
      } else {
        nextScreen(navigation, NEWPASSWORD_VIEW, { phonenumber: phoneNumber });
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
  }, [
    isVietnamesePhoneNumber,
    phoneNumber,
    isEmpty,
    checkConnected,
    navigation,
    formatPhoneNumber,
    nextScreen,
  ]);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View>
          <DescriptionScreens text={`Nhập số điện thoại`} />
          <View style={{ padding: 10 }}>
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
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <CustomButton
              title={`Tiếp tục`}
              width={200}
              disabled={phoneNumber === "" || loading}
              handlePress={() => handleNext()}
              padding={12}
            />
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
};

export default memo(ForgotPassword);
