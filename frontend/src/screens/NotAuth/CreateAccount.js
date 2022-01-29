import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Animated, View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import DismissKeyboard from "../../components/DismissKeyBoard";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../../components/RegisterView/Footer";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, FOCUS_COLOR } from "../../shared/const";
import CustomTextInput from "../../components/customs/CustomTextInput";
import { checkConnected, isEmpty, isVietnamesePhoneNumber, nextScreen } from "../../shared/logic";
import { findByPhone } from "../../../services/user.services";
import { CONFIRMACCOUNT_VIEW, USEREXISTED_VIEW } from "../../shared/views";

const CreateAccount = ({ route, navigation }) => {
  const { fullName, phoneNumberC } = route.params; // Nhận dữ liệu từ màn trước
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("");
  const [loading, setLoading] = useState(false);

  const animation = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(-10),
    }),
    []
  );

  useEffect(() => {
    if (phoneNumberC) {
      setPhoneNumber(phoneNumberC);
    }
  }, [phoneNumberC]);

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
    const res = await findByPhone({ phonenumber: phoneNumber }); // Kiểm tra số điện thoại đã đc dùng chưa 
    setLoading(false);
    if (res?.code === 1000) {
      if (isEmpty(res?.data)) {
        nextScreen(navigation, CONFIRMACCOUNT_VIEW, {
          phonenumber: phoneNumber,
          fullname: fullName,
        });
      } else {
        nextScreen(navigation, USEREXISTED_VIEW, { user: res?.data, phonenumber: phoneNumber });
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
  }, [isVietnamesePhoneNumber, phoneNumber, isEmpty, checkConnected, navigation, nextScreen]);

  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <DescriptionScreens text={`Nhập số điện thoại của bạn để tạo tài khoản mới`} />
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
        <Footer />
      </View>
    </DismissKeyboard>
  );
};

export default memo(CreateAccount);
