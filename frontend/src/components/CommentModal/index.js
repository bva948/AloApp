import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import FIcon from "react-native-vector-icons/FontAwesome";
import IonIcon from "react-native-vector-icons/Ionicons";
import SIcon from "react-native-vector-icons/SimpleLineIcons";
import { getPostComment, sendPostComment } from "../../../services/social.services";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  PRIMARY_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import { checkConnected, getStrapiMedia, isEmpty, nextScreen, timeSince } from "../../shared/logic";
import { FRIENDINFO_VIEW } from "../../shared/views";
import CustomTextInput from "../customs/CustomTextInput";
import DismissKeyBoard from "../DismissKeyBoard";
import Spinner from "../Spinner";
import Header from "./Header";

const windowHeight = Dimensions.get("window").height;

const CommentModal = ({ item, setShowModal, handleLike, handleComment, navigation }) => {
  const flalistComment = useRef();
  const { isLogin, userInfo, setIsLogin, setUserInfo, socket } = useContextApp();
  const [height, setHeight] = useState(windowHeight - 30);
  const inputRef = useRef();
  const [comment, setComment] = useState("");
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [loadSendComment, setLoadSendComment] = useState(false);
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(true);
  const [loadMoreComment, setLoadMoreComment] = useState(false);

  useEffect(() => {
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    (async () => {
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        setLoading(false);
        return;
      }
      const rs = await getPostComment({ pid: item?.id }, userInfo);
      setLoading(false);
      if (rs?.code === 1000) {
        setListComment(rs?.data?.lData);
        setPagination(rs?.data?.pagination);
        setTimeout(() => {
          flalistComment.current?.scrollToEnd({ animated: true });
        }, 300);
        return;
      }
      if (rs?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setIsLogin(false);
        setUserInfo({});
        return;
      } else {
        Alert.alert("Không phản hồi", rs.msg, [
          {
            text: "Đóng",
          },
        ]);
      }
    })();
  }, [item?.id, userInfo, isLogin]);

  const handleChangeSize = () => {
    let tmp = height;
    if (tmp > windowHeight * 0.7) {
      tmp = windowHeight - 30;
    } else {
      setShowModal(false);
      return;
    }
    setHeight(tmp);
  };

  useEffect(() => {
    // nhhận sự kiện ai đó bình luận
    const getComment = async (comment) => {
      if (parseInt(comment?.pid, 10) === item?.id) {
        setListComment((pre) => [...pre, comment]);
        setTimeout(() => {
          flalistComment.current?.scrollToEnd({ animated: true });
        }, 350);
      }
    };
    socket.current.on(`getComment`, getComment);
    return async () => await socket?.current?.off(`getComment`, getComment);
  }, [socket?.current, item?.id, flalistComment.current]);

  const sendComment = useCallback(async () => {
    // xử lý gửi bình luận
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    setLoadSendComment(true);
    const rs = await sendPostComment({ pid: item?.id, uid: userInfo?.id, comment }, userInfo); // gọi api bình luận
    setLoadSendComment(false);
    if (rs?.code === 1000) {
      setListComment((pre) => [...pre, rs?.data]);
      setTimeout(() => {
        flalistComment.current?.scrollToEnd({ animated: true });
      }, 350);
      setComment("");
      inputRef.current.blur();
      handleComment();
      socket.current.emit(`sendComment`, {
        data: rs?.data,
        uid: parseInt(rs?.data?.uid, 10),
      });
      return;
    }
    if (rs?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    } else {
      Alert.alert("Không phản hồi", rs.msg, [
        {
          text: "Đóng",
        },
      ]);
    }
  }, [comment, userInfo, isLogin, item?.id, inputRef?.current, socket?.current]);

  const loadMore = async () => {
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    if (loadMoreComment) return;
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    setLoadMoreComment(true);
    const rs = await getPostComment({ pid: item?.id, page: pagination?.page + 1 }, userInfo);
    setLoadMoreComment(false);
    if (rs?.code === 1000) {
      setListComment((pre) => [rs?.data?.lData, ...pre].flat());
      setPagination(rs?.data?.pagination);
      return;
    }
    if (rs?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    } else {
      Alert.alert("Không phản hồi", rs.msg, [
        {
          text: "Đóng",
        },
      ]);
    }
  };

  const handlePress = (info) => {
    if (info?.id === userInfo?.id) return;
    nextScreen(navigation, FRIENDINFO_VIEW, { userId: info?.id });
    setShowModal(false);
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: `#8e8e8e61`,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={setShowModal} />
        <PanGestureHandler
          onGestureEvent={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              let height = Math.round(windowHeight - nativeEvent.absoluteY);
              if (height > windowHeight - 30) {
                height = windowHeight - 30;
              }
              setHeight(height);
            }
          }}
        >
          <View
            style={{
              backgroundColor: WHITE_COLOR,
              height: height,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
            onTouchEnd={handleChangeSize}
          >
            <Header setShowModal={setShowModal} />
            <Pressable style={styles.likeStyle} onPress={() => handleLike(item?.id)}>
              {item?.isUserLike ? (
                <FIcon name={`heart`} size={25} style={{ paddingRight: 7 }} color={`red`} />
              ) : (
                <FIcon name={`heart-o`} size={25} style={{ paddingRight: 7 }} color={`#333333`} />
              )}
              <Text style={{ fontSize: 17 }}>{item?.likeCount}</Text>
            </Pressable>

            {loading ? (
              <Spinner />
            ) : listComment.length > 0 ? (
              <FlatList
                ref={flalistComment}
                data={listComment}
                ListHeaderComponent={
                  <>
                    {pagination?.hasMore && (
                      <>
                        {loadMoreComment ? (
                          <Spinner />
                        ) : (
                          <Pressable
                            style={{
                              padding: 10,
                              borderBottomWidth: 0.5,
                              borderBottomColor: BORDER_BOTTOM_COLOR,
                            }}
                            onPress={loadMore}
                          >
                            <Text style={{ color: PRIMARY_COLOR }}>Xem thêm</Text>
                          </Pressable>
                        )}
                      </>
                    )}
                  </>
                }
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.containercomment}>
                      <View style={{ marginRight: 10, marginLeft: 10, paddingTop: 20 }}>
                        <Pressable onPress={() => handlePress(item?.userInfo)}>
                          {item?.userInfo?.avatar ? (
                            <Image
                              style={{ ...styles.image }}
                              source={{
                                uri: getStrapiMedia(item?.userInfo?.avatar),
                              }}
                            />
                          ) : (
                            <View style={{ ...styles.image }} />
                          )}
                        </Pressable>
                      </View>

                      <View
                        style={[
                          styles.rightComponent,
                          { borderBottomWidth: index === listComment.length - 1 ? 0 : 0.5 },
                        ]}
                      >
                        <View style={styles.row}>
                          <Text
                            style={[
                              styles.name,
                              {
                                fontWeight: "500",
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {item?.userInfo?.fullname}
                          </Text>
                          <Text
                            style={{
                              ...styles.text,
                              fontSize: 12,
                              fontWeight: "600",
                              color: TEXT_GRAY_COLOR,
                            }}
                          >
                            {timeSince(item?.created_at)}
                          </Text>
                        </View>
                        <View style={styles.message}>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.text]}>{item?.comment}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1 }}
              />
            ) : (
              <DismissKeyBoard>
                <View
                  style={{ flex: 1, padding: 10, justifyContent: `center`, alignItems: `center` }}
                >
                  <Text>Chưa có bình luận nào</Text>
                </View>
              </DismissKeyBoard>
            )}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "padding"}
              style={{ height: emojiSelector ? "50%" : "auto" }}
              keyboardVerticalOffset={30}
            >
              <View style={styles.rowinput}>
                <View style={{ justifyContent: "center", backgroundColor: WHITE_COLOR }}>
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
                <CustomTextInput
                  placeholder="Nhập bình luận"
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
                  onChangeText={(value) => setComment(value)}
                  inputValue={comment}
                  textInputStyle={{
                    fontSize: 16,
                  }}
                  inputRef={inputRef}
                />
                <View style={{ justifyContent: "center", marginLeft: 30 }}>
                  <IonIcon
                    name="ios-send"
                    size={30}
                    color={comment ? `#008bff` : TEXT_GRAY_COLOR}
                    onPress={() => {
                      if (!loadSendComment && !!comment) {
                        sendComment();
                      }
                    }}
                  />
                </View>
              </View>
              {emojiSelector && (
                <EmojiSelector
                  onEmojiSelected={(emoji) => setComment((c) => c + emoji)}
                  showSearchBar={false}
                  showSectionTitles={false}
                  columns={8}
                />
              )}
            </KeyboardAvoidingView>
          </View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: WHITE_COLOR,
    padding: 0,
  },
  rowinput: {
    borderTopWidth: 0.5,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    borderTopColor: BORDER_BOTTOM_COLOR,
  },
  imageComponent: {
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    backgroundColor: WHITE_COLOR,
    borderWidth: 1,
    borderColor: "#bcc3d9",
  },
  likeStyle: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    flexDirection: `row`,
  },
  containercomment: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: WHITE_COLOR,
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
    paddingBottom: 20,
    paddingTop: 20,
    paddingRight: 10,
    borderBottomColor: BORDER_BOTTOM_COLOR,
  },
  name: {
    fontSize: 15,
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

export default CommentModal;
