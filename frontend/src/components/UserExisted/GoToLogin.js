import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PRIMARY_COLOR } from "../../shared/const";
import { nextScreen } from "../../shared/logic";
import { LOGIN_VIEW } from "../../shared/views";

const GoToLogin = ({ navigation, phonenumber, fullname }) => {
  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 16, alignItems: "center" }}>
        Nếu <Text style={{ fontWeight: "bold" }}>{fullname}</Text> là tài khoản của bạn,
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={{ marginTop: 5 }}
        onPress={() => nextScreen(navigation, LOGIN_VIEW, { phonenumber })}
      >
        <Text
          style={{ color: PRIMARY_COLOR, fontSize: 16, fontWeight: "500", textAlign: "center" }}
        >
          đăng nhập tại đây
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(GoToLogin);
