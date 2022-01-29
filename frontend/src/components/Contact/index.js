import React, { memo } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ACTIVE_COLOR, BLACK_COLOR, RED_COLOR, WHITE_COLOR } from "../../shared/const";
import { getStrapiMedia } from "../../shared/logic";
import Icon from "react-native-vector-icons/MaterialIcons";

const ContactItem = ({ item, hanldeRemoveContact, handleClick }) => {
  let seft;
  return (
    <Swipeable
      ref={(ref) => (seft = ref)}
      renderRightActions={(dragX) =>
        deleteComponent(dragX, () => {
          hanldeRemoveContact(item);
          seft.close();
        })
      }
    >
      <Pressable
        style={{
          flexDirection: "row",
          padding: 10,
          paddingBottom: 15,
          paddingTop: 15,
          backgroundColor: WHITE_COLOR,
        }}
        onPress={() => handleClick(item)}
      >
        <View>
          {item?.avatar ? (
            <Image
              source={{
                uri: getStrapiMedia(item?.avatar),
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                overflow: "hidden",
                backgroundColor: `#808080`,
              }}
            />
          ) : (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                overflow: "hidden",
                backgroundColor: `#808080`,
              }}
            />
          )}
          {item?.active && (
            <View
              style={{
                width: 11,
                height: 11,
                borderRadius: 11,
                backgroundColor: ACTIVE_COLOR,
                position: "absolute",
                borderWidth: 1,
                borderColor: WHITE_COLOR,
                overflow: `hidden`,
                left: 2,
              }}
            />
          )}
        </View>
        <Text
          style={{
            color: BLACK_COLOR,
            padding: 10,
            fontSize: 14,
          }}
        >
          {item.value}
        </Text>
      </Pressable>
    </Swipeable>
  );
};

const deleteComponent = (dragX, cb) => {
  let scaleX = dragX.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  });
  return (
    <Animated.View style={{ ...styles.deleteComponent, transform: [{ scaleX: scaleX }] }}>
      <Pressable onPress={() => cb()}>
        <Icon name="delete" size={25} color={WHITE_COLOR} />
        <Text style={{ color: WHITE_COLOR, fontSize: 13 }}>Xóa</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deleteComponent: {
    backgroundColor: RED_COLOR,
    width: 80,
    maxWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(ContactItem);
