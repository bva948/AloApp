import React, { memo } from "react";
import { Text, View } from "react-native";

export const DescriptionScreens = memo(({ text, bgColor = "#efefef" }) => {
  return (
    <View style={{ padding: 10, backgroundColor: bgColor }}>
      <Text style={{ color: "#333333" }}>{text}</Text>
    </View>
  );
});
