import React, { memo } from "react";
import { View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { BG_MODAL_COLOR, BORDER_BOTTOM_COLOR, PRIMARY_COLOR } from "../../shared/const";

const Header = ({ disable, postStatus, handleBack = () => {} }) => {
  const handleClick = () => {
    if (disable) return;
    postStatus();
  };
  return (
    <View
      style={{
        flexDirection: `row`,
        justifyContent: `space-between`,
        width: `100%`,
        alignItems: `center`,
        padding: 10,
        paddingTop: 25,
        borderBottomWidth: 0.5,
        borderBottomColor: BORDER_BOTTOM_COLOR,
        backgroundColor: BG_MODAL_COLOR,
      }}
    >
      <IonIcon
        name={`close-outline`}
        size={30}
        style={{ margin: 0, padding: 0 }}
        onPress={handleBack}
        color={`#333333`}
      />
      <IonIcon
        name="ios-send"
        size={25}
        color={disable ? `#767676` : PRIMARY_COLOR}
        style={{ paddingRight: 5 }}
        onPress={handleClick}
      />
    </View>
  );
};

export default memo(Header);
