import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { getPostById } from "../../../services/account.services";
import { upLoadImage } from "../../../services/chat.services";
import { deletePost, likePost, postStatus, updatePost } from "../../../services/social.services";
import { updateUserInfo } from "../../../services/user.services";
import CommentModal from "../../components/CommentModal";
import CustomModal from "../../components/CustomModal";
import SearchView from "../../components/SearchView";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  GREEN_COLOR,
  PRIMARY_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import { checkConnected, getStrapiMedia, isEmpty, nextScreen, timeSince } from "../../shared/logic";
import { MODAL_VIEW } from "../../shared/views";

const Account = ({ navigation }) => {
  const {
    searchInputFocus,
    userInfo,
    setIsLogin,
    setUserInfo,
    postDataAccount,
    setPostDataAccount,
    isLogin,
    socket,
  } = useContextApp();

  const isFocus = useIsFocused();
  const [pagination, setPagination] = useState();
  const [listPost, setListPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postData, setPostData] = useState({});
  const [showModalCommnent, setShowModalComment] = useState(false);
  const [imageTmp, setImageTmp] = useState();
  const [imageBTmp, setImageBTmp] = useState();
  const [loadImage, setLoadImage] = useState(false);
  const [likeLoad, setLikeLoad] = useState(false);

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
      const rs = await getPostById({ uid: userInfo?.id }, userInfo);
      if (rs?.code === 503) {
        Alert.alert("Không phản hồi", rs?.msg, [
          {
            text: "Đóng",
          },
        ]);
        setLoading(false);
        return;
      }
      if (rs?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setLoading(false);
        setIsLogin(false);
        setUserInfo({});
        return;
      }
      setPagination(rs?.data?.pagination);
      setListPost(rs?.data?.lData);
      setLoading(false);
    })();
  }, [userInfo, reload, isFocus, isLogin]);

  useEffect(() => {
    // lắng nghe like post
    const getLikePost = (data) => {
      setListPost((pre) =>
        pre.map((item) => {
          if (item?.id === data?.pid) {
            return { ...item, likeCount: data?.like ? item?.likeCount + 1 : item?.likeCount - 1 };
          }
          return item;
        })
      );
    };
    // lắng nghe comment
    const getComment = (comment) => {
      setListPost((pre) =>
        pre.map((item) => {
          if (parseInt(comment?.pid, 10) === item?.id) {
            return { ...item, commentCount: item?.commentCount + 1 };
          }

          return item;
        })
      );
    };
    socket.current.on(`getComment`, getComment);
    socket?.current?.on(`getLikePost`, getLikePost);
    return async () => {
      await socket?.current?.off(`getLikePost`, getLikePost);
      await socket?.current?.off(`getComment`, getComment);
    };
  }, [socket?.current]);

  useEffect(() => {
    if (isEmpty(listPost)) return;
    setPostData((pre) => {
      if (!isEmpty(pre)) {
        const newData = listPost.find((item) => item?.id === pre?.id);
        return newData;
      }
      return pre;
    });
  }, [listPost]);

  useEffect(() => {
    // chạy khi có yêu cầu đăng bài viết
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    if (postDataAccount) {
      if (postDataAccount?.isEdit) {
        (async () => {
          const isConnected = await checkConnected();
          if (!isConnected) {
            Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
              {
                text: "Đóng",
              },
            ]);
            setPostDataAccount(null);
            return;
          }
          if (postDataAccount?.image && postDataAccount?.image?.isMobile) {
            let arr = postDataAccount?.image?.uri.split(`.`);
            const end = arr.pop();
            const type = `image/` + end;
            const name = new Date() + `_image.${end}`;
            const data = {
              type: type,
              name: name,
              uri: postDataAccount?.image?.uri,
              alternativeText: "",
              caption: "",
            };
            const formData = new FormData();
            formData.append(`files`, data);
            const rs = await upLoadImage(formData);
            if (rs?.code === 503) {
              Alert.alert("Không phản hồi", rs?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              return;
            }
            if (rs?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            if (rs instanceof Array) {
              const newPost = {
                content: postDataAccount?.content,
                listImage: rs?.map((item) => ({ image: item?.id })),
              };
              const result = await updatePost(postDataAccount?.id, newPost);
              if (result?.code === 503) {
                Alert.alert("Không phản hồi", result?.msg, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostDataAccount(null);
                return;
              }
              setReload((pre) => !pre);
              setPostDataAccount(null);
            }
          } else {
            const newPost = {
              content: postDataAccount?.content,
            };
            if (!postDataAccount?.image) {
              newPost[`listImage`] = [];
            }
            const result = await updatePost(postDataAccount?.id, newPost);
            if (result?.code === 503) {
              Alert.alert("Không phản hồi", result?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              return;
            }
            setReload((pre) => !pre);
            setPostDataAccount(null);
          }
        })();
      } else {
        (async () => {
          const isConnected = await checkConnected();
          if (!isConnected) {
            Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
              {
                text: "Đóng",
              },
            ]);
            setPostDataAccount(null);
            return;
          }
          if (postDataAccount?.image) {
            let arr = postDataAccount?.image?.uri.split(`.`);
            const end = arr.pop();
            const type = `image/` + end;
            const name = new Date() + `_image.${end}`;
            const data = {
              type: type,
              name: name,
              uri: postDataAccount?.image?.uri,
              alternativeText: "",
              caption: "",
            };
            const formData = new FormData();
            formData.append(`files`, data);
            const rs = await upLoadImage(formData);
            if (rs?.code === 503) {
              Alert.alert("Không phản hồi", rs?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              return;
            }
            if (rs?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            if (rs instanceof Array) {
              const post = {
                author: userInfo?.id,
                content: postDataAccount?.content,
                listImage: rs?.map((item) => ({ image: item?.id })),
              };
              const result = await postStatus(post, userInfo); // gọi api tạo bài việt
              if (result?.code === 503) {
                Alert.alert("Không phản hồi", result?.msg, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostDataAccount(null);
                return;
              }
              if (result?.code === 9998) {
                Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostDataAccount(null);
                setIsLogin(false);
                setUserInfo({});
                return;
              }
              setPostDataAccount(null);
              setTimeout(() => {
                setListPost((pre) => {
                  const { page, pageSize } = pagination;
                  if (pre?.length < page * pageSize) return [result?.data, ...pre];
                  setPagination((pre) => ({ ...pre, hasMore: true }));
                  return [result?.data, ...pre.slice(0, page * pageSize - 1)];
                });
              }, 200);
            }
          } else {
            const post = {
              author: userInfo?.id,
              content: postDataAccount?.content,
            };
            const result = await postStatus(post, userInfo); // gọi api tạo bài viết
            if (result?.code === 503) {
              Alert.alert("Không phản hồi", result?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              return;
            }
            if (result?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostDataAccount(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            setPostDataAccount(null);
            setTimeout(() => {
              setListPost((pre) => {
                const { page, pageSize } = pagination;
                if (pre?.length < page * pageSize) return [result?.data, ...pre];
                setPagination((pre) => ({ ...pre, hasMore: true }));
                return [result?.data, ...pre.slice(0, page * pageSize - 1)];
              });
            }, 200);
          }
        })();
      }
    }
  }, [postDataAccount, userInfo, isLogin, pagination?.page, pagination?.pageSize]);

  const imageClick = useCallback(
    async (isAvatar) => {
      if (loadImage) return;
      if (Platform.OS !== "web") {
        const libResponse = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libResponse.status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        if (isAvatar) {
          setImageTmp({
            uri: result.uri,
          });
        } else {
          setImageBTmp({
            uri: result.uri,
          });
        }
        setLoadImage(true);
        const url = result.uri;
        let arr = url.split(`.`);
        const end = arr.pop();
        const type = `image/` + end;
        const name = new Date() + `_image.${end}`;
        const data = {
          type: type,
          name: name,
          uri: url,
          alternativeText: "",
          caption: "",
        };
        const formData = new FormData();
        formData.append(`files`, data);
        let rs = await upLoadImage(formData);
        if (rs?.code === 503) {
          Alert.alert("Không phản hồi", `Có lỗi xảy ra. Vui lòng thử lại sau.`, [
            {
              text: "Đóng",
            },
          ]);
          setImageTmp(null);
          setImageBTmp(null);
          setLoadImage(false);
          return;
        }
        if (!isEmpty(rs)) {
          rs = rs?.[0];
          if (isAvatar) {
            await updateUserInfo(userInfo?.id, { avatar: rs?.id });
            setImageTmp(null);
            setUserInfo((pre) => ({ ...pre, avatar: rs?.url }));
          } else {
            await updateUserInfo(userInfo?.id, { backgroundImage: rs?.id });
            setImageBTmp(null);
            setUserInfo((pre) => ({ ...pre, backgroundImage: rs?.url }));
          }
          setLoadImage(false);
        }
      }
    },
    [userInfo, loadImage]
  );

  const handleLike = useCallback(
    async (pid) => {
      if (likeLoad) return;
      const isConnected = await checkConnected();
      if (!isConnected) {
        Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
      setLikeLoad(true);
      const rs = await likePost(
        {
          uid: userInfo?.id,
          pid: pid,
        },
        userInfo
      );
      if (rs?.code === 503) {
        Alert.alert("Không phản hồi", rs?.msg, [
          {
            text: "Đóng",
          },
        ]);
        setLikeLoad(false);
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
        setLikeLoad(false);
        return;
      }
      if (rs?.data?.like) {
        const newData = listPost?.map((item) => {
          if (item?.id === pid) {
            return {
              ...item,
              likeCount: parseInt(item?.likeCount, 10) + 1,
              isUserLike: true,
            };
          }
          return item;
        });
        setListPost(newData);
      } else {
        const newData = listPost?.map((item) => {
          if (item?.id === pid) {
            return {
              ...item,
              likeCount: parseInt(item?.likeCount, 10) - 1,
              isUserLike: false,
            };
          }
          return item;
        });
        setListPost(newData);
      }
      socket?.current?.emit(`likePost`, {
        pid,
        like: rs?.data?.like,
        uid: parseInt(userInfo?.id, 10),
      });
      setLikeLoad(false);
    },
    [userInfo, listPost, likeLoad, socket?.current]
  );

  const loadMore = useCallback(async () => {
    // tải thêm dữ liệu nếu hasMore = true
    if (!pagination?.hasMore) return;
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    const rs = await getPostById({ uid: userInfo?.id, page: pagination?.page + 1 }, userInfo); // gọi api
    setListPost((pre) => [...pre, rs?.data?.lData].flat()); // nối dữ liệu vào cái cũ
    setPagination(rs?.data?.pagination);
  }, [pagination, checkConnected]);

  const handleDelete = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      Alert.alert(`Xoá bài đăng`, `Bạn thực sự muốn xoá bài viết này?`, [
        {
          text: "Huỷ",
        },
        {
          text: "Xoá",
          onPress: async () => {
            const rs = await deletePost(postData?.id, userInfo);
            if (rs?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            setListPost((pre) => pre.filter((item) => item?.id !== postData?.id));
            setPostData({});
          },
        },
      ]);
    }, 1000);
  }, [postData]);

  const handleEdit = useCallback(async () => {
    setShowModal(false);
    nextScreen(navigation, MODAL_VIEW, { data: postData, isAccount: true });
  }, [postData]);

  const imageClickBefore = useCallback(async () => {
    // click vào icon đăng ảnh
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
      nextScreen(navigation, MODAL_VIEW, {
        imageC: {
          uri: result.uri,
          isMobile: true,
        },
        isAccount: true,
      });
    }
  }, []);

  const handleComment = async () => {
    const newData = listPost?.map((item) => {
      if (item?.id === postData?.id) {
        return {
          ...item,
          commentCount: parseInt(postData?.commentCount, 10) + 1,
        };
      }
      return item;
    });
    setListPost(newData);
  };

  return (
    <>
      {loading ? (
        <View
          style={{
            zIndex: 2,
            position: `absolute`,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: WHITE_COLOR,
          }}
        >
          <Spinner />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ alignItems: `center` }}>
                <TouchableWithoutFeedback onPress={() => imageClick(false)}>
                  {userInfo?.backgroundImage || imageBTmp ? (
                    <View
                      style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: BORDER_BOTTOM_COLOR,
                        width: `100%`,
                        backgroundColor: `#808080`,
                      }}
                    >
                      <Image
                        source={{
                          uri: imageBTmp
                            ? imageBTmp?.uri
                            : getStrapiMedia(userInfo?.backgroundImage),
                        }}
                        style={{
                          width: `100%`,
                          height: 200,
                        }}
                      />
                      {loadImage && imageBTmp && (
                        <View
                          style={{
                            backgroundColor: `#abaaaabf`,
                            width: `100%`,
                            height: 200,
                            zIndex: 2,
                            position: `absolute`,
                            top: 0,
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        width: `100%`,
                        height: 200,
                        backgroundColor: `#808080`,
                        borderBottomWidth: 0.5,
                        borderBottomColor: BORDER_BOTTOM_COLOR,
                      }}
                    />
                  )}
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => imageClick(true)}>
                  {userInfo?.avatar || imageTmp ? (
                    <View
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 120,
                        borderWidth: 3,
                        borderColor: WHITE_COLOR,
                        position: `relative`,
                        bottom: 70,
                        zIndex: 2,
                        backgroundColor: `#808080`,
                      }}
                    >
                      <Image
                        source={{
                          uri: imageTmp ? imageTmp?.uri : getStrapiMedia(userInfo?.avatar),
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 120,
                        }}
                      />
                      {loadImage && imageTmp && (
                        <View
                          style={{
                            backgroundColor: `#abaaaabf`,
                            width: `100%`,
                            height: "100%",
                            borderRadius: 120,
                            position: `absolute`,
                            top: 0,
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 120,
                        borderWidth: 3,
                        borderColor: WHITE_COLOR,
                        position: `relative`,
                        bottom: 70,
                        backgroundColor: `#808080`,
                      }}
                    />
                  )}
                </TouchableWithoutFeedback>
                <View style={{ position: `relative`, top: -60 }}>
                  <Text style={{ fontSize: 20, fontWeight: `500` }}>{userInfo?.fullname}</Text>
                </View>
              </View>
              <View
                style={{
                  position: `relative`,
                  top: -30,
                  flexDirection: `row`,
                  justifyContent: "space-between",
                  margin: 10,
                  padding: 15,
                  backgroundColor: WHITE_COLOR,
                  borderRadius: 5,
                  zIndex: 10,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => nextScreen(navigation, MODAL_VIEW, { isAccount: true })}
                >
                  <View>
                    <Text style={{ fontSize: 19, color: TEXT_GRAY_COLOR, width: `100%` }}>
                      Bạn đang nghĩ gì?
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={imageClickBefore}>
                  <View
                    style={{
                      borderLeftWidth: 0.5,
                      borderLeftColor: BORDER_BOTTOM_COLOR,
                      flexDirection: `row`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      paddingLeft: 15,
                    }}
                  >
                    <Icon name="image" size={35} color={GREEN_COLOR} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {postDataAccount && (
                <View
                  style={{
                    position: `relative`,
                    top: 0,
                    borderRadius: 5,
                    margin: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      position: `absolute`,
                      backgroundColor: `#d2d2d2d1`,
                      width: `100%`,
                      height: `100%`,
                      zIndex: 2,
                      borderRadius: 5,
                    }}
                  >
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                  </View>
                  <View>
                    <View
                      style={{
                        width: 90,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#7a7a7a",
                          borderRadius: 7,
                          alignItems: `center`,
                        }}
                      >
                        <Text
                          style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 3,
                            paddingBottom: 3,
                            color: WHITE_COLOR,
                            fontSize: 13,
                          }}
                        >
                          Hôm nay
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: WHITE_COLOR,
                        paddingTop: 10,
                        borderRadius: 5,
                      }}
                    >
                      <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }}>
                        {postDataAccount?.content?.length > 0 && (
                          <Text style={{ marginBottom: 10 }}>{postDataAccount?.content}</Text>
                        )}
                        {postDataAccount?.image && (
                          <Image
                            source={
                              postDataAccount?.image?.isMobile
                                ? { uri: postDataAccount?.image?.uri }
                                : { uri: getStrapiMedia(postDataAccount?.image?.uri) }
                            }
                            style={{ height: 400, resizeMode: "contain", marginBottom: 10 }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          padding: 10,
                          paddingTop: 0,
                          justifyContent: "space-between",
                          flexDirection: `row`,
                        }}
                      >
                        <View style={{ flexDirection: `row`, alignItems: `center` }}>
                          <FIcon name={`heart-o`} size={25} style={{ paddingRight: 7 }} />
                          <Text style={{ fontSize: 17 }}>0</Text>
                        </View>
                        <View>
                          <MIcon name={`dots-horizontal`} size={25} color={`#504d4d`} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          }
          data={listPost}
          renderItem={({ item }) => (
            <View>
              <View
                style={{
                  marginLeft: 10,
                  width: 100,
                }}
              >
                <View style={{ backgroundColor: "#7a7a7a", borderRadius: 7, alignItems: `center` }}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 3,
                      paddingBottom: 3,
                      color: WHITE_COLOR,
                      fontSize: 13,
                    }}
                  >
                    {timeSince(item?.created_at)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: WHITE_COLOR,
                  paddingTop: 10,
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }}>
                  {item?.content?.length > 0 && (
                    <Text style={{ marginBottom: 10 }}>{item?.content}</Text>
                  )}
                  {item?.listImage?.map((image) => (
                    <Image
                      source={{ uri: getStrapiMedia(image?.image?.url) }}
                      style={{ height: 300, resizeMode: "contain", marginBottom: 10 }}
                      key={image?.id}
                    />
                  ))}
                </View>
                <View
                  style={{
                    padding: 10,
                    paddingTop: 0,
                    justifyContent: "space-between",
                    flexDirection: `row`,
                  }}
                >
                  <View style={{ padding: 10, paddingTop: 0, flexDirection: `row` }}>
                    <Pressable
                      style={{ flexDirection: `row`, alignItems: `center` }}
                      onPress={() => handleLike(item?.id)}
                    >
                      {item?.isUserLike ? (
                        <FIcon name={`heart`} size={25} style={{ paddingRight: 7 }} color={`red`} />
                      ) : (
                        <FIcon
                          name={`heart-o`}
                          size={25}
                          style={{ paddingRight: 7 }}
                          color={`#333333`}
                        />
                      )}
                      <Text style={{ fontSize: 17 }}>{item?.likeCount}</Text>
                    </Pressable>
                    <Pressable
                      style={{ marginLeft: 20, flexDirection: `row`, alignItems: `center` }}
                      onPress={() => {
                        setShowModalComment(true);
                        setPostData(item);
                      }}
                    >
                      <MIcon
                        name={"comment-processing-outline"}
                        style={{ paddingRight: 5 }}
                        size={24}
                        color={`#333333`}
                      />
                      <Text style={{ fontSize: 17 }}>{item?.commentCount || 0}</Text>
                    </Pressable>
                  </View>
                  <View>
                    <MIcon
                      name={`dots-horizontal`}
                      size={25}
                      color={`#504d4d`}
                      onPress={() => {
                        setShowModal(true);
                        setPostData(item);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => setReload((pre) => !pre)} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          style={{ flex: 1 }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      {showModalCommnent && (
        <CommentModal
          item={postData}
          setShowModal={() => setShowModalComment(false)}
          handleLike={handleLike}
          handleComment={handleComment}
          navigation={navigation}
        />
      )}
      {searchInputFocus && <SearchView />}
    </>
  );
};

export default Account;
