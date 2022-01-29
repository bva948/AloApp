import React, { memo } from "react";
import { Text, View } from "react-native";
import { PRIMARY_COLOR } from "../../../shared/const";
import { nextScreen } from "../../../shared/logic";
import { ADDFRIENDREQUEST_VIEW } from "../../../shared/views";

const RequestAddFriend = ({ navigation }) => {
  return (
    <View
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: "#b8bbbf",
        margin: 10,
        paddingBottom: 10,
        marginBottom: 0,
      }}
    >
      <View style={{ justifyContent: `space-between`, flexDirection: "row" }}>
        <Text>Lời mời kết bạn </Text>
        <Text
          style={{ color: PRIMARY_COLOR }}
          onPress={() => nextScreen(navigation, ADDFRIENDREQUEST_VIEW)}
        >
          Xem tất cả {`>>`}
        </Text>
      </View>
    </View>
  );
};

export default memo(RequestAddFriend);
