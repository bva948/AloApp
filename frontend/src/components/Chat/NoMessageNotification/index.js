import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const NoMessageNotification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bạn chưa có tin nhắn mới nào</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
  },
});

export default memo(NoMessageNotification);
