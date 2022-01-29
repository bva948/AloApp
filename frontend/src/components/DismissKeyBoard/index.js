import React, { memo } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default memo(DismissKeyboard);
