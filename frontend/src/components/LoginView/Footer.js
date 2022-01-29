import React, { memo } from "react";
import { Text, View } from "react-native";

const Footer = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 15,
        alignItems: "center",
      }}
    >
      <View style={{ borderBottomWidth: 1, borderBottomColor: "rgb(149, 141, 141)" }}>
        <Text style={{ color: "rgb(149, 141, 141)", paddingBottom: 2, fontWeight: "500" }}>
          Các câu hỏi thường gặp
        </Text>
      </View>
    </View>
  );
};

export default memo(Footer);
