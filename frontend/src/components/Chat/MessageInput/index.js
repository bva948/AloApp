import * as ImagePicker from "expo-image-picker";
import React, { memo, useCallback, useRef, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/EvilIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import SIcon from "react-native-vector-icons/SimpleLineIcons";
import { PRIMARY_COLOR, TEXT_GRAY_COLOR, WHITE_COLOR } from "../../../shared/const";
import CustomTextInput from "../../customs/CustomTextInput";

const MessageInput = ({ handleSend, hanldeSendImage, isFriend }) => {
  const inputRef = useRef();
  const [message, setMesage] = useState("");
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [image, setImage] = useState(null);
  const [loadSendMessage, setLoadSendMessage] = useState(false);

  const pickImage = useCallback(async () => {
    if (Platform.OS !== "web") {
      const libResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libResponse.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!isFriend) {
      Alert.alert(
        `Không thể thực hiện`,
        `Bạn không thể gửi tin nhắn cho một người không phải là bạn bè.`,
        [{ text: `Đóng` }]
      );
      return;
    }
    if (image) {
      // nếu có ảnh ảnh
      let arr = image.split(`.`);
      const end = arr.pop();
      const type = `image/` + end;
      const name = new Date() + `_image.${end}`;
      const data = {
        type: type,
        name: name,
        uri: image,
        alternativeText: "",
        caption: "",
      };
      const formData = new FormData(); // xử lý ảnh
      formData.append(`files`, data);
      hanldeSendImage(
        formData,
        () => setImage(null),
        (value) => setLoadSendMessage(value)
      );
    } else {
      handleSend(
        message,
        () => setMesage(""),
        (value) => setLoadSendMessage(value)
      );
    }
  }, [handleSend, message, image, isFriend, hanldeSendImage]);

  return (
    <>
      {image && (
        <View style={{ backgroundColor: "#e2e9f1" }}>
          <View style={styles.imageComponent}>
            <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 10 }} />
            <AntDesign
              name="close"
              size={25}
              style={{ position: "absolute", right: 0 }}
              color={TEXT_GRAY_COLOR}
              onPress={() => setImage()}
            />
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { height: emojiSelector ? "50%" : "auto" }]}
        keyboardVerticalOffset={65}
      >
        <View style={styles.row}>
          <View style={{ justifyContent: "center" }}>
            <SIcon
              name="emotsmile"
              size={25}
              color={emojiSelector ? PRIMARY_COLOR : `#767676`}
              onPress={() => {
                setEmojiSelector(!emojiSelector);
                inputRef.current.blur();
              }}
            />
          </View>
          {!image && (
            <CustomTextInput
              placeholder="Tin nhắn"
              multiline={true}
              viewStyle={{
                backgroundColor: WHITE_COLOR,
                justifyContent: "center",
                flex: 1,
                marginLeft: 10,
                marginRight: 5,
                maxHeight: 100,
              }}
              onFocus={() => {
                setEmojiSelector(false);
              }}
              onBlur={() => {}}
              onChangeText={(value) => setMesage(value)}
              inputValue={message}
              textInputStyle={{
                fontSize: 16,
              }}
              inputRef={inputRef}
            />
          )}
          <View style={{ justifyContent: "center", marginLeft: 30 }}>
            {message || image ? (
              <IonIcon
                name="ios-send"
                size={30}
                color={loadSendMessage ? `#767676` : `#008bff`}
                onPress={() => {
                  if (!loadSendMessage) {
                    sendMessage();
                  }
                }}
              />
            ) : (
              <Icon
                name="image"
                size={40}
                color={`#767676`}
                onPress={() => {
                  pickImage();
                  inputRef.current.blur();
                  setEmojiSelector(false);
                }}
              />
            )}
          </View>
        </View>
        {emojiSelector && (
          <EmojiSelector
            onEmojiSelected={(emoji) => setMesage((c) => c + emoji)}
            showSearchBar={false}
            showSectionTitles={false}
            columns={8}
          />
        )}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE_COLOR,
    padding: 0,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  imageComponent: {
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    backgroundColor: WHITE_COLOR,
    borderWidth: 1,
    borderColor: "#bcc3d9",
  },
});

export default memo(MessageInput);
