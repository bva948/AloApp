import React, { memo } from "react";
import { Text, View } from "react-native";
import { BLACK_COLOR, BORDER_BOTTOM_COLOR, WHITE_COLOR } from "../../../shared/const";

const SectionHeader = ({ section }) => {
  return (
    <View
      style={{
        backgroundColor: WHITE_COLOR,
        borderTopColor: BORDER_BOTTOM_COLOR,
        borderTopWidth: 0.5,
        marginLeft: 10,
      }}
    >
      <Text
        style={{
          color: BLACK_COLOR,
          padding: 10,
        }}
      >
        {section.title}
      </Text>
    </View>
  );
};

export default memo(SectionHeader);
