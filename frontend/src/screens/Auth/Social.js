import { useIsFocused } from "@react-navigation/native";
import { is } from "date-fns/locale";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { upLoadImage } from "../../../services/chat.services";
import {
  deletePost,
  getPostStatus,
  likePost,
  postStatus,
  updatePost,
} from "../../../services/social.services";
import CommentModal from "../../components/CommentModal";
import CustomModal from "../../components/CustomModal";
import SearchView from "../../components/SearchView";
import PostItem from "../../components/Social/PostItem";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  GREEN_COLOR,
  PRIMARY_COLOR,
  RED_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import { checkConnected, getStrapiMedia, isEmpty, nextScreen } from "../../shared/logic";
import { MODAL_VIEW } from "../../shared/views";

const Social = ({ navigation }) => {
  const {
    userInfo,
    postData,
    setPostData,
    setUserInfo,
    setIsLogin,
    searchInputFocus,
    isLogin,
    socket,
  } = useContextApp();
  const isFocus = useIsFocused();
  const [listPost, setListPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCommnent, setShowModalComment] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [likeLoad, setLikeLoad] = useState(false);

  useEffect(() => {
    if (isEmpty(userInfo)) return;
    if (!isLogin) return;
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
      const rs = await getPostStatus({ uid: userInfo?.id }, userInfo);
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
        setIsLogin(false);
        setUserInfo({});
        setLoading(false);
        return;
      }
      setLoading(false);
      setListPost(rs?.data?.lData);
      setPagination(rs?.data?.pagination);
    })();
  }, [userInfo, refresh, isFocus, isLogin]);

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
    setDataUpdate((pre) => {
      if (!isEmpty(pre)) {
        const newData = listPost.find((item) => item?.id === pre?.id);
        return newData;
      }
      return pre;
    });
  }, [listPost]);

  useEffect(() => {
    if (!isLogin) return;
    if (isEmpty(userInfo)) return;
    if (postData) {
      if (postData?.isEdit) {
        (async () => {
          const isConnected = await checkConnected();
          if (!isConnected) {
            Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
              {
                text: "Đóng",
              },
            ]);
            setPostData(null);
            return;
          }
          if (postData?.image && postData?.image?.isMobile) {
            let arr = postData?.image?.uri.split(`.`);
            const end = arr.pop();
            const type = `image/` + end;
            const name = new Date() + `_image.${end}`;
            const data = {
              type: type,
              name: name,
              uri: postData?.image?.uri,
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
              setPostData(null);
              return;
            }
            if (rs?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostData(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            if (rs instanceof Array) {
              const newPost = {
                content: postData?.content,
                listImage: rs?.map((item) => ({ image: item?.id })),
              };
              const result = await updatePost(postData?.id, newPost);
              if (result?.code === 503) {
                Alert.alert("Không phản hồi", result?.msg, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostData(null);
                return;
              }
              setRefresh((pre) => !pre);
              setPostData(null);
            }
          } else {
            const newPost = {
              content: postData?.content,
            };
            if (!postData?.image) {
              newPost[`listImage`] = [];
            }
            const result = await updatePost(postData?.id, newPost);
            if (result?.code === 503) {
              Alert.alert("Không phản hồi", result?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostData(null);
              return;
            }
            setRefresh((pre) => !pre);
            setPostData(null);
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
            setPostData(null);
            return;
          }
          if (postData?.image) {
            let arr = postData?.image?.uri.split(`.`);
            const end = arr.pop();
            const type = `image/` + end;
            const name = new Date() + `_image.${end}`;
            const data = {
              type: type,
              name: name,
              uri: postData?.image?.uri,
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
              setPostData(null);
              return;
            }
            if (rs?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostData(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            if (rs instanceof Array) {
              const post = {
                author: userInfo?.id,
                content: postData?.content,
                listImage: rs?.map((item) => ({ image: item?.id })),
              };
              const result = await postStatus(post, userInfo);
              if (result?.code === 503) {
                Alert.alert("Không phản hồi", result?.msg, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostData(null);
                return;
              }
              if (result?.code === 9998) {
                Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                  {
                    text: "Đóng",
                  },
                ]);
                setPostData(null);
                setIsLogin(false);
                setUserInfo({});
                return;
              }
              setPostData(null);
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
              content: postData?.content,
            };
            const result = await postStatus(post, userInfo);
            if (result?.code === 503) {
              Alert.alert("Không phản hồi", result?.msg, [
                {
                  text: "Đóng",
                },
              ]);
              setPostData(null);
              return;
            }
            if (result?.code === 9998) {
              Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
                {
                  text: "Đóng",
                },
              ]);
              setPostData(null);
              setIsLogin(false);
              setUserInfo({});
              return;
            }
            setPostData(null);
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
  }, [postData, userInfo, isLogin, pagination?.page, pagination?.pageSize]);

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
      nextScreen(navigation, MODAL_VIEW, {
        imageC: {
          uri: result.uri,
          isMobile: true,
        },
      });
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!isLogin) return;
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
    const rs = await getPostStatus({ uid: userInfo?.id, page: pagination?.page + 1 }, userInfo);
    setListPost((pre) => [...pre, rs?.data?.lData].flat());
    setPagination(rs?.data?.pagination);
  }, [userInfo, pagination, isLogin]);

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
        setLikeLoad(false);
        setUserInfo({});
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

  const handleComment = async () => {
    const newData = listPost?.map((item) => {
      if (item?.id === dataUpdate?.id) {
        return {
          ...item,
          commentCount: parseInt(dataUpdate?.commentCount, 10) + 1,
        };
      }
      return item;
    });
    setListPost(newData);
  };

  const handleEdit = useCallback(() => {
    setShowModal(false);
    nextScreen(navigation, MODAL_VIEW, {
      data: dataUpdate,
    });
  }, [dataUpdate]);

  const handleDelete = useCallback(async () => {
    setShowModal(false);
    setTimeout(() => {
      Alert.alert(`Xoá bài đăng`, `Bạn thực sự muốn xoá bài viết này?`, [
        {
          text: "Huỷ",
        },
        {
          text: "Xoá",
          onPress: async () => {
            const rs = await deletePost(dataUpdate?.id, userInfo);
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
            setListPost((pre) => pre.filter((item) => item?.id !== dataUpdate?.id));
            setDataUpdate({});
          },
        },
      ]);
    }, 1000);
  }, [dataUpdate, userInfo]);

  return (
    <>
      {searchInputFocus && <SearchView />}
      {loading && (
        <View style={{ zIndex: 2, position: `absolute`, top: 0, right: 0, bottom: 0, left: 0 }}>
          <Spinner />
        </View>
      )}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ backgroundColor: WHITE_COLOR, marginBottom: 10, width: `100%` }}>
              <View
                style={{ padding: 10, flexDirection: `row`, alignItems: `center`, width: `100%` }}
              >
                {userInfo?.avatar ? (
                  <Image
                    source={{
                      uri: getStrapiMedia(userInfo?.avatar),
                    }}
                    style={styles.image}
                  />
                ) : (
                  <View style={{ ...styles.image }} />
                )}
                <Pressable
                  style={{
                    flexDirection: `row`,
                    alignItems: `center`,
                    justifyContent: `center`,
                  }}
                  onPress={() => nextScreen(navigation, MODAL_VIEW)}
                >
                  <Text
                    style={{ marginLeft: 15, fontSize: 18, color: TEXT_GRAY_COLOR, width: `100%` }}
                  >
                    Hôm nay bạn thế nào?
                  </Text>
                </Pressable>
              </View>
              <Pressable
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: BORDER_BOTTOM_COLOR,
                  padding: 10,
                  flexDirection: `row`,
                  alignItems: `center`,
                  justifyContent: `center`,
                }}
                onPress={imageClick}
              >
                <Icon name="image" size={35} color={GREEN_COLOR} />
                <Text style={{ fontWeight: `bold` }}>Đăng ảnh</Text>
              </Pressable>
            </View>
            {postData && (
              <View style={{ backgroundColor: WHITE_COLOR, marginBottom: 10 }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: `absolute`,
                    backgroundColor: `#d2d2d2d1`,
                    width: `100%`,
                    height: `100%`,
                    zIndex: 2,
                  }}
                >
                  <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
                <View
                  style={{ flexDirection: `row`, justifyContent: `space-between`, padding: 10 }}
                >
                  {userInfo?.avatar ? (
                    <Image
                      source={{
                        uri: getStrapiMedia(userInfo?.avatar),
                      }}
                      style={styles.postAvatar}
                    />
                  ) : (
                    <View style={{ ...styles.postAvatar }} />
                  )}
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: `500` }}>{userInfo?.fullname}</Text>
                    <Text style={{ fontSize: 13, fontWeight: `400` }}>Hôm nay</Text>
                  </View>
                  <MIcon name={`dots-horizontal`} size={25} color={`#504d4d`} />
                </View>
                <View style={{ padding: 10, paddingTop: 0 }}>
                  {postData?.content.length > 0 && (
                    <Text style={{ marginBottom: 10 }}>{postData?.content}</Text>
                  )}
                  {postData?.image && (
                    <Image
                      source={
                        postData?.image?.isMobile
                          ? { uri: postData?.image?.uri }
                          : { uri: getStrapiMedia(postData?.image?.uri) }
                      }
                      style={{ height: 400, resizeMode: "contain", marginBottom: 10 }}
                    />
                  )}
                </View>
              </View>
            )}
          </>
        }
        data={listPost}
        renderItem={({ item }) => (
          <PostItem
            item={item}
            handleLike={handleLike}
            key={item?.id}
            setShowModal={() => {
              if (userInfo?.id === parseInt(item?.author?.id)) {
                setShowModal(true);
                setDataUpdate(item);
              }
            }}
            setShowModalComment={() => {
              setShowModalComment(true);
              setDataUpdate(item);
            }}
            navigation={navigation}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => setRefresh((pre) => !pre)} />
        }
      />
      <CustomModal
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      {showModalCommnent && (
        <CommentModal
          item={dataUpdate}
          setShowModal={() => setShowModalComment(false)}
          handleLike={handleLike}
          handleComment={handleComment}
          navigation={navigation}
        />
      )}
    </>
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
    borderBottomColor: "#b8bbbf",
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: `#808080`,
  },
});

export default Social;
