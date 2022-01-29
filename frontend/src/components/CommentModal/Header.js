import React, { memo } from "react";
import { Text, View } from "react-native";
import { BORDER_BOTTOM_COLOR, TEXT_GRAY_COLOR } from "../../shared/const";
import AntDesign from "react-native-vector-icons/AntDesign";

const Header = ({ setShowModal }) => {
  return (
    <View
      style={{
        justifyContent: `center`,
        alignItems: `center`,
        borderBottomColor: BORDER_BOTTOM_COLOR,
        padding: 10,
        borderBottomWidth: 0.5,
      }}
    >
      <Text style={{ fontSize: 18 }}>Bình luận</Text>
      <AntDesign
        name="close"
        size={25}
        style={{ position: "absolute", right: 10 }}
        color={TEXT_GRAY_COLOR}
        onPress={() => setShowModal(false)}
      />
    </View>
  );
};

export default memo(Header);
