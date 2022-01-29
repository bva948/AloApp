import React, { memo, useCallback, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useContextApp } from "../../../../ContextAPI";
import { TEXT_GRAY_COLOR, WHITE_COLOR } from "../../../../shared/const";
import {
  checkTime,
  dateTimeFormat,
  getStrapiMedia,
  nextScreen,
  timeFormat,
  timeM,
} from "../../../../shared/logic";
import { FRIENDINFO_VIEW } from "../../../../shared/views";

const Message = ({ isMe = false, message, isFirst, reciveUser, nextMessage, navigation }) => {
  const { width } = useWindowDimensions();

  const check = useMemo(
    () => checkTime(message?.createdAt, nextMessage?.createdAt),
    [message?.createdAt, nextMessage?.createdAt]
  );
  const displayAvatar = useCallback(() => {
    const date1 = new Date(message.createdAt);
    const date2 = new Date(nextMessage?.createdAt);
    const rs = Math.floor((date2 - date1) / (1000 * 60));
    if (
      nextMessage?.senderId !== message?.senderId ||
      (nextMessage?.senderId === message?.senderId && rs > 15)
    ) {
      return (
        <Pressable
          onPress={() => nextScreen(navigation, FRIENDINFO_VIEW, { userId: reciveUser?.id })}
        >
          {reciveUser?.avatar ? (
            <Image
              source={{
                uri: getStrapiMedia(reciveUser?.avatar),
              }}
              style={[styles.image, { backgroundColor: `#808080` }]}
            />
          ) : (
            <View style={{ ...styles.image, backgroundColor: `#808080` }} />
          )}
        </Pressable>
      );
    }
    return <View style={styles.image} />;
  }, [message, nextMessage, reciveUser]);

  const getDateTime = useCallback(
    (dateTime) => {
      const ctime = new Date();
      const ck = checkTime(dateTime, ctime);
      if (ck.days === 0) {
        return timeFormat(dateTime);
      }
      return dateTimeFormat(dateTime);
    },
    [checkTime, timeFormat, dateTimeFormat]
  );
  return (
    <>
      <View
        style={[
          styles.container,
          {
            marginLeft: isMe ? "auto" : 10,
            marginRight: isMe ? 10 : "auto",
            marginBottom: isFirst ? 5 : 0,
          },
        ]}
      >
        {!isMe && displayAvatar()}
        {message?.image ? (
          <View
            style={{
              width: width * 0.7,
              height: width * 0.7,
              marginLeft: 10,
            }}
          >
            <Image
              source={{ uri: getStrapiMedia(message?.image) }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 13,
                borderWidth: 0.5,
                borderColor: "#bcc3d9",
              }}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View
            style={[
              styles.message,
              {
                backgroundColor: isMe ? "#d0f2fe" : WHITE_COLOR,
                borderWidth: 1,
                borderColor: "#bcc3d9",
              },
            ]}
          >
            <Text style={{ fontSize: 15, minWidth: 50 }}>
              {message?.content || `Chat rom mot tin nhan`}
            </Text>
            {/* {!isMe && (
              
            )} */}
            <Text style={{ fontSize: 11, marginTop: 1, color: TEXT_GRAY_COLOR }}>
              {timeM(message?.createdAt)}
            </Text>
          </View>
        )}
      </View>
      {(!nextMessage || check.days > 0) && (
        <View style={styles.dateTimeMessage}>
          <View style={styles.dateTimeBox}>
            <Text style={styles.dateTimeText}>{getDateTime(message?.createdAt)}</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 7,
    flexDirection: "row",
    marginTop: 5,
  },
  message: {
    padding: 10,
    borderRadius: 7,
    marginLeft: 10,
    maxWidth: "80%",
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 30,
  },
  dateTimeMessage: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  dateTimeBox: {
    backgroundColor: "#7a7a7a",
    borderRadius: 20,
  },
  dateTimeText: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    color: WHITE_COLOR,
    fontSize: 13,
  },
});

export default memo(Message);
