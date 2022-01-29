import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WHITE_COLOR } from "../../shared/const";

const SearchView = () => {
  return (
    <View style={cstyles.container}>
      <Text style={{ color: WHITE_COLOR }}>Tin Nhawns</Text>
    </View>
  );
};
const cstyles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#333333",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default memo(SearchView);
