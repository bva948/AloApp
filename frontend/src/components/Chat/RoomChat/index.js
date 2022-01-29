import React, { memo } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  ACTIVE_COLOR,
  BLACK_COLOR,
  BORDER_BOTTOM_COLOR,
  RED_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../../shared/const";
import { getStrapiMedia, nextScreen, timeSince } from "../../../shared/logic";
import { CHATROOM_VIEW } from "../../../shared/views";

const deleteComponent = (dragX, cb) => {
  const scaleX = dragX.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  });
  return (
    <Animated.View style={{ ...styles.deleteComponent, transform: [{ scaleX: scaleX }] }}>
      <Pressable onPress={cb}>
        <Icon name="delete" size={25} color={WHITE_COLOR} />
        <Text style={{ color: WHITE_COLOR, fontSize: 13 }}>Xóa</Text>
      </Pressable>
    </Animated.View>
  );
};

const RoomChat = ({
  navigation,
  roomChat,
  isLastItem,
  lastMessageIsMe,
  handleRemove,
  setIsReload,
}) => {
  let seft;
  return (
    <Swipeable
      ref={(ref) => (seft = ref)}
      renderRightActions={(dragX) =>
        deleteComponent(dragX, () => {
          handleRemove(roomChat);
          seft.close();
          setIsReload((pre) => !pre);
        })
      }
    >
      <Pressable
        onPress={() => nextScreen(navigation, CHATROOM_VIEW, { roomChat: roomChat })}
        style={styles.container}
      >
        <View style={{ marginRight: 10, marginLeft: 10 }}>
          {roomChat.reciveUser.avatar ? (
            <Image
              source={{
                uri: getStrapiMedia(roomChat.reciveUser.avatar),
              }}
              style={styles.image}
            />
          ) : (
            <View style={{ ...styles.image }} />
          )}
          {roomChat?.reciveUser?.active && (
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
                left: 3,
              }}
            />
          )}
        </View>
        <View style={[styles.rightComponent, { borderBottomWidth: isLastItem ? 0 : 0.5 }]}>
          <View style={styles.row}>
            <Text
              style={[
                styles.name,
                { fontWeight: !lastMessageIsMe && roomChat?.lastMessage?.unRead ? "600" : "400" },
              ]}
              numberOfLines={1}
            >
              {roomChat?.reciveUser?.fullname || `HiHi`}
            </Text>
            <Text
              style={{
                ...styles.text,
                fontSize: 12,
                fontWeight: !lastMessageIsMe && roomChat?.lastMessage?.unRead ? "600" : "400",
                color:
                  !lastMessageIsMe && roomChat?.lastMessage?.unRead ? BLACK_COLOR : TEXT_GRAY_COLOR,
              }}
            >
              {timeSince(roomChat?.lastMessage?.createdAt)}
            </Text>
          </View>
          <View style={styles.message}>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.text,
                  {
                    fontWeight: !lastMessageIsMe && roomChat?.lastMessage?.unRead ? "600" : "400",
                    color:
                      !lastMessageIsMe && roomChat?.lastMessage?.unRead
                        ? BLACK_COLOR
                        : TEXT_GRAY_COLOR,
                  },
                ]}
              >
                {roomChat?.lastMessage?.image
                  ? lastMessageIsMe
                    ? `Bạn đã gửi một ảnh`
                    : `${roomChat?.reciveUser?.fullname} đã gửi một ảnh`
                  : roomChat?.lastMessage?.content || "Bắt đầu cuộc trò chuyện."}
              </Text>
            </View>
            {roomChat?.totalUnRead > 0 && (
              <View style={styles.noteRead}>
                <Text style={styles.notReadText}>
                  {roomChat?.totalUnRead <= 5 ? roomChat?.totalUnRead : "5+"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE_COLOR,
  },
  deleteComponent: {
    backgroundColor: RED_COLOR,
    width: 80,
    maxWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `#808080`,
  },
  rightComponent: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
    borderBottomColor: BORDER_BOTTOM_COLOR,
  },
  name: {
    fontSize: 17,
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: TEXT_GRAY_COLOR,
  },
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteRead: {
    backgroundColor: RED_COLOR,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 20,
  },
  notReadText: {
    color: WHITE_COLOR,
    fontSize: 10,
    fontWeight: "600",
  },
});

export default memo(RoomChat);
