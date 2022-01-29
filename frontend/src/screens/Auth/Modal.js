import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/EvilIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import SIcon from "react-native-vector-icons/SimpleLineIcons";
import CustomTextInput from "../../components/customs/CustomTextInput";
import Header from "../../components/Modal/Header";
import { useContextApp } from "../../ContextAPI";
import { BG_MODAL_COLOR, PRIMARY_COLOR, WHITE_COLOR } from "../../shared/const";
import { getStrapiMedia } from "../../shared/logic";

const Modal = ({ route, navigation }) => {
  const inputRef = useRef();
  const { imageC, data, isAccount = false } = route.params;
  const { setPostData, setPostDataAccount } = useContextApp();
  const [content, setContent] = useState(``);
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (imageC) {
      setImage(imageC);
    }
    if (data) {
      setContent(data?.content);
      if (data?.listImage.length) {
        setImage({
          uri: data?.listImage?.[0]?.image?.url,
          isMobile: false,
        });
      }
    }
  }, []);

  const imageClick = useCallback(async () => {
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
    });
    if (!result.cancelled) {
      setImage({
        uri: result.uri,
        isMobile: true,
      });
    }
  }, []);

  const postStatus = useCallback(() => {
    if (isAccount) {
      if (data) {
        setPostDataAccount({
          content,
          image,
          isEdit: true,
          id: data?.id,
        });
      } else {
        setPostDataAccount({
          content,
          image,
        });
      }
    } else {
      if (data) {
        setPostData({
          content,
          image,
          isEdit: true,
          id: data?.id,
        });
      } else {
        setPostData({
          content,
          image,
        });
      }
    }
    navigation.pop();
  }, [image, content, isAccount]);

  const handleDisable = () => {
    if (data) {
      if (content !== data?.content || image?.uri !== data?.listImage?.[0]?.image?.url)
        return false;
      return true;
    } else {
      return !content && !image;
    }
  };

  const handleBack = () => {
    if (image || content) {
      Alert.alert(`Xác nhận`, `Bài viết này chưa được lưu bạn có muốn huỷ?`, [
        { text: `Không` },
        { text: `Có`, onPress: () => navigation.pop() },
      ]);
    } else {
      navigation.pop();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        navigation={navigation}
        disable={handleDisable()}
        postStatus={postStatus}
        handleBack={handleBack}
      />
      <ScrollView style={styles.scrollViewStyle}>
        <CustomTextInput
          placeholder="Bạn đang nghĩ gì?"
          multiline={true}
          viewStyle={styles.viewStyle}
          onFocus={() => {
            setEmojiSelector(false);
          }}
          onBlur={() => {}}
          onChangeText={(value) => setContent(value)}
          inputValue={content}
          textInputStyle={{
            fontSize: 16,
          }}
          inputRef={inputRef}
        />
        {image && (
          <View style={{ flex: 1, paddingBottom: 20, paddingTop: 10 }}>
            <Image
              source={image?.isMobile ? { uri: image?.uri } : { uri: getStrapiMedia(image?.uri) }}
              style={{ height: 400, resizeMode: "contain", marginBottom: 10 }}
            />
            <View style={styles.closeImage}>
              <IonIcon
                name={`close-outline`}
                size={25}
                onPress={() => {
                  inputRef.current.blur();
                  setImage(null);
                }}
                color={WHITE_COLOR}
                style={{ position: `absolute`, top: -2 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ height: emojiSelector ? "50%" : `auto` }}
        keyboardVerticalOffset={0}
      >
        <View style={styles.row}>
          <View style={{ justifyContent: "center" }}>
            <SIcon
              name="emotsmile"
              size={25}
              color={emojiSelector ? PRIMARY_COLOR : `#767676`}
              onPress={() => {
                setEmojiSelector((pre) => !pre);
                inputRef.current.blur();
              }}
            />
          </View>
          <View>
            <Icon
              name="image"
              size={40}
              color={`#767676`}
              onPress={() => {
                imageClick();
                inputRef.current.blur();
                setEmojiSelector(false);
              }}
            />
          </View>
        </View>
        {emojiSelector && (
          <EmojiSelector
            onEmojiSelected={(emoji) => setContent((c) => c + emoji)}
            showSearchBar={false}
            showSectionTitles={false}
            columns={8}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: BG_MODAL_COLOR,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: WHITE_COLOR,
  },
  viewStyle: {
    backgroundColor: WHITE_COLOR,
    flex: 1,
    marginRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    maxHeight: 300,
  },
  imageComponent: {
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    backgroundColor: WHITE_COLOR,
    borderWidth: 1,
    borderColor: "#bcc3d9",
  },
  closeImage: {
    position: `absolute`,
    right: 2,
    top: 12,
    backgroundColor: `#716f6fc4`,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: `center`,
    borderWidth: 1,
    borderColor: WHITE_COLOR,
  },
});

export default Modal;
