import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Animated, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import DismissKeyboard from "../../components/DismissKeyBoard";
import { DescriptionScreens } from "../../components/NotAuthCommon";
import Footer from "../../components/RegisterView/Footer";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, FOCUS_COLOR } from "../../shared/const";
import { containNumber, containSpecificCharacter, nextScreen } from "../../shared/logic";
import { CREATEACCOUNT_VIEW } from "../../shared/views";

const Register = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [fullName, setFullName] = useState("");
  const [fullNameFocus, setFullNameFocus] = useState(false);
  const [error, setError] = useState(false);
  const [errorSMS, setErrorSMS] = useState("Loi");

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

  const handleNext = useCallback(() => {
    if (containSpecificCharacter(fullName)) {
      setErrorSMS("Tên chứa ký tự không hợp lệ.");
      setError(true);
      return;
    }
    if (containNumber(fullName)) {
      setErrorSMS("Tên không được chứa chữ số.");
      setError(true);
      return;
    }
    const nameLength = fullName.length;
    if (nameLength < 2 || nameLength > 40) {
      setErrorSMS(
        `${nameLength < 2 ? "Tên quá ngắn" : "Tên quá dài"}. Tên hợp lệ phải gồm 2-40 ký tự.`
      );
      setError(true);
      return;
    }
    nextScreen(navigation, CREATEACCOUNT_VIEW, {
      fullName,
      phoneNumberC: phoneNumber,
    });
  }, [navigation, containSpecificCharacter, containNumber, fullName, nextScreen, phoneNumber]);
  return (
    <DismissKeyboard>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <DescriptionScreens text={`Sử dụng tên thật giúp bạn bè dễ dàng nhận ra bạn`} />
          <View style={{ padding: 10 }}>
            <CustomTextInput
              viewStyle={{ marginBottom: 2, position: "relative", justifyContent: "center" }}
              placeholder="Tên đầy đủ"
              onChangeText={(value) => {
                setFullName(value);
                if (error) {
                  setError(false);
                  setErrorSMS("");
                }
              }}
              textInputStyle={{
                paddingTop: 12,
                paddingRight: 40,
                paddingBottom: fullNameFocus ? 11 : 12,
                borderBottomWidth: fullNameFocus ? 2 : 1,
                borderBottomColor: fullNameFocus ? FOCUS_COLOR : BORDER_BOTTOM_COLOR,
                color: BLACK_COLOR,
                fontSize: 18,
              }}
              onFocus={() => setFullNameFocus(true)}
              onBlur={() => setFullNameFocus(false)}
              inputValue={fullName}
            >
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 5,
                  alignItems: "center",
                }}
              >
                {fullNameFocus && fullName.length > 0 && (
                  <Icon
                    name="close-outline"
                    color="gray"
                    size={20}
                    onPress={() => setFullName("")}
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
              disabled={fullName === ""}
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

export default memo(Register);
