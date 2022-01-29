import React, { memo } from "react";
import { View, ActivityIndicator } from "react-native";
import { PRIMARY_COLOR } from "../../shared/const";

const Spinner = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="small" color={PRIMARY_COLOR} />
    </View>
  );
};

export default memo(Spinner);
