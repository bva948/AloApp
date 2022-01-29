import React, { memo } from "react";
import { TextInput, View } from "react-native";

const CustomTextInput = ({
  onChangeText,
  isHide,
  placeholder = "placeholder",
  inputValue,
  onEndEditing,
  textInputStyle = "",
  viewStyle,
  keyboardType = "default",
  placeholderTextColor = "#767676",
  onBlur,
  onFocus,
  multiline = false,
  inputRef = null,
  children,
}) => {
  return (
    <View style={viewStyle}>
      <TextInput
        multiline={multiline}
        style={textInputStyle}
        placeholder={placeholder}
        secureTextEntry={isHide}
        value={inputValue}
        onBlur={onBlur}
        onFocus={onFocus}
        onChangeText={(value) => onChangeText(value)}
        onEndEditing={onEndEditing}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
        ref={inputRef}
      />
      {children}
    </View>
  );
};

export default memo(CustomTextInput);
