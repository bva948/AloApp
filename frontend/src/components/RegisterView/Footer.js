import React, { memo } from "react";
import { Text, View } from "react-native";

const Footer = () => {
  return (
    <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20, alignItems: "center" }}>
      <Text>Tiếp tục nghĩa là bạn đồng ý</Text>
      <Text>
        với các{` `}
        <Text style={{ textDecorationLine: "underline" }}>điều khoản</Text> sử dụng Zalo.
      </Text>
    </View>
  );
};

export default memo(Footer);
