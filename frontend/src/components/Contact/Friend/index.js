import React, { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useContextApp } from "../../../ContextAPI";
import { PRIMARY_COLOR, TEXT_GRAY_COLOR, WHITE_COLOR } from "../../../shared/const";
import { formatPhoneNumber, getStrapiMedia, nextScreen } from "../../../shared/logic";
import { FRIENDINFO_VIEW } from "../../../shared/views";
import CustomButton from "../../customs/CustomButton";

const Friend = ({ friend, handleAddFriend, handleAccept, navigation, handleDelete = () => {} }) => {
  const { userInfo } = useContextApp();
  const { fullname, avatar = null, isRQAF = null } = friend;
  const handlePress = () => {
    if (userInfo?.id === friend?.id) return;
    nextScreen(navigation, FRIENDINFO_VIEW, { userId: friend?.id });
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        {avatar ? (
          <Image
            source={{
              uri: getStrapiMedia(avatar),
            }}
            style={styles.image}
          />
        ) : (
          <View style={{ ...styles.image }} />
        )}
      </Pressable>
      <View style={styles.rightComponent}>
        <View style={styles.row}>
          <Text style={[styles.name, { fontWeight: "400" }]} numberOfLines={1}>
            {fullname || `No Name`}
          </Text>
        </View>
        <View style={styles.row}>
          {isRQAF ? (
            <Text style={[styles.text, { fontWeight: "400" }]} numberOfLines={1}>
              {isRQAF === true ? formatPhoneNumber(friend?.phonenumber) : `Đã gửi yêu cầu kết bạn`}
            </Text>
          ) : (
            <Text style={[styles.text, { fontWeight: "400" }]} numberOfLines={1}>
              Số điện thoại:{" "}
              <Text style={{ color: PRIMARY_COLOR }}>
                {formatPhoneNumber(friend?.phonenumber || `0962168903`)}
              </Text>
            </Text>
          )}
        </View>
      </View>
      {friend?.waitting && (
        <CustomButton
          title={`Huỷ`}
          width={80}
          handlePress={() => handleDelete(friend?.rId)}
          padding={5}
        />
      )}
      {friend?.showBtn &&
        (isRQAF === true ? (
          <CustomButton title={`Đồng ý`} width={80} handlePress={handleAccept} padding={5} />
        ) : (
          <CustomButton title={`Kết bạn`} width={80} handlePress={handleAddFriend} padding={5} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE_COLOR,
    paddingRight: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: `#808080`,
  },
  rightComponent: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
  },
  name: {
    fontSize: 17,
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: TEXT_GRAY_COLOR,
  },
});

export default memo(Friend);
