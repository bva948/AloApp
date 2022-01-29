import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BTN_DISABLE_COLOR, PRIMARY_COLOR, TEXT_WHITE_COLOR } from "../../shared/const";

const CustomButton = ({
  title,
  width = "80%",
  backgroundColor = PRIMARY_COLOR,
  textStyle = TEXT_WHITE_COLOR,
  handlePress,
  disabled = false,
  padding = 10,
  viewStyle = {},
}) => {
  const buttonSylte = {
    alignItems: "center",
    backgroundColor: disabled ? BTN_DISABLE_COLOR : backgroundColor,
    padding: padding,
    marginVertical: 5,
    borderRadius: 25,
    opacity: 0.9,
  };
  return (
    <View style={{ ...viewStyle, maxWidth: 400, width, justifyContent: "center" }}>
      <TouchableOpacity
        onPress={() => handlePress()}
        style={buttonSylte}
        disabled={disabled}
        activeOpacity={1}
      >
        <Text style={disabled ? TEXT_WHITE_COLOR : textStyle}>{title || "Button"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(CustomButton);
