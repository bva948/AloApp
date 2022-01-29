import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, View } from "react-native";
import { getPostById } from "../../../services/account.services";
import { getFriendInfo } from "../../../services/user.services";
import Spinner from "../../components/Spinner";
import { useContextApp } from "../../ContextAPI";
import { BORDER_BOTTOM_COLOR, WHITE_COLOR } from "../../shared/const";
import { checkConnected, getStrapiMedia, isEmpty, timeSince } from "../../shared/logic";
import FIcon from "react-native-vector-icons/FontAwesome";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Pressable } from "react-native";
import {
  acceptRequest,
  deleteRequest,
  getIsFriend,
  requestAddFriend,
} from "../../../services/contact.services";
import CustomButton from "../../components/customs/CustomButton";
import CommentModal from "../../components/CommentModal";
import { likePost } from "../../../services/social.services";

const FriendInfo = ({ route, navigation }) => {
  const uId = route.params.userId;
  const { isLogin, setIsLogin, setUserInfo, userInfo, socket, setTotalRequest } = useContextApp();
  const [infoFriend, setInfoFriend] = useState({});
  const [listPost, setListPost] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [isFriend, setIsFriend] = useState({});
  const [showModalCommnent, setShowModalComment] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [likeLoad, setLikeLoad] = useState(false);

  useEffect(() => {
    if (!isLogin) return;
    (async () => {
      const [rs, rs1] = await Promise.all([
        getFriendInfo({ fid: uId }, userInfo),
        getIsFriend({ uid: userInfo?.id, fid: uId }),
      ]);
      setIsFriend(rs1?.data);
      if (rs?.code === 1000) {
        setInfoFriend(rs?.data);
      } else if (rs?.code === 9998) {
        Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
          {
            text: "Đóng",
          },
        ]);
        setIsLogin(false);
        setUserInfo({});
        return;
      } else {
        Alert.alert("Không phản hồi", result?.msg, [
          {
            text: "Đóng",
          },
        ]);
        return;
      }
    })();
  }, [uId, userInfo]);

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
    if (isEmpty(infoFriend)) return;
    navigation.setOptions({ title: infoFriend?.fullname || "No name" });
    if (!isFriend?.isFriend) {
      setLoading(false);
      setListPost([]);
      return;
    }
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
      const rs = await getPostById({ uid: infoFriend?.id }, userInfo);
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
  }, [infoFriend, reload, isFriend]);

  const showView = useCallback(() => {
    if (!isFriend?.isRQAF & !isFriend?.isSRQAF)
      return (
        <View
          style={{
            alignItems: `center`,
            marginLeft: `auto`,
            marginRight: `auto`,
          }}
        >
          <Text>Kết bạn với {infoFriend?.fullname} ngay để cùng tạo nên những</Text>
          <Text style={{ marginBottom: 10 }}>cuộc trò chuyện thú vị và đáng nhớ </Text>
          <CustomButton title={`Kết bạn`} width={100} handlePress={handleAddFriend} padding={7} />
        </View>
      );
    if (isFriend?.isRQAF & !isFriend?.isSRQAF) {
      return (
        <View
          style={{
            marginLeft: `auto`,
            alignItems: `center`,
            marginRight: `auto`,
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            Đã gửi lời mời kết bạn tới {infoFriend?.fullname}
          </Text>
          <CustomButton title={`Huỷ`} width={100} handlePress={handleDelete} padding={7} />
        </View>
      );
    }

    if (!isFriend?.isRQAF & isFriend?.isSRQAF) {
      return (
        <View
          style={{
            marginLeft: `auto`,
            alignItems: `center`,
            marginRight: `auto`,
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            {userInfo?.fullname} đã gửi lời mời kết bạn tới bạn
          </Text>
          <View style={{ flexDirection: `row`, justifyContent: `space-between` }}>
            <CustomButton
              title={`Đồng ý`}
              width={100}
              handlePress={handleAccept}
              padding={7}
              viewStyle={{ marginRight: 5 }}
            />
            <CustomButton
              title={`Huỷ`}
              width={100}
              handlePress={() => {
                handleDelete();
                setTotalRequest((pre) => pre - 1);
              }}
              padding={7}
              viewStyle={{ marginLeft: 5 }}
            />
          </View>
        </View>
      );
    }
  }, [isFriend, infoFriend, handleAddFriend, handleDelete, handleAccept, userInfo]);

  const handleAddFriend = useCallback(async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    const data = {
      senderId: userInfo?.id,
      reciverId: infoFriend?.id,
      message: "test",
    };
    const res = await requestAddFriend(data, userInfo);
    if (res?.code === 1000) {
      setIsFriend((pre) => ({
        ...pre,
        isRQAF: true,
        isSRQAF: false,
        isFriend: false,
        rId: res?.data?.id,
      }));
      realTimeRQAF(res?.data);
      return;
    }
    if (res?.code === 503) {
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  }, [requestAddFriend, infoFriend, userInfo, checkConnected]);

  const realTimeRQAF = useCallback(
    (data) => {
      if (!isEmpty(data)) {
        socket.current.emit(`sendRQAF`, data);
      }
    },
    [socket?.current]
  );

  const handleAccept = useCallback(async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    const res = await acceptRequest(
      { uid: userInfo?.id, fid: infoFriend?.id, rId: isFriend?.rId },
      userInfo
    );
    if (res?.code === 1000) {
      setTotalRequest((pre) => pre - 1);
      setIsFriend((pre) => ({ ...pre, isFriend: true, isSRQAF: false, isRQAF: false }));
    } else if (res?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
    } else {
      Alert.alert("Không phản hồi", res?.msg, [
        {
          text: "Đóng",
        },
      ]);
    }
  }, [checkConnected, userInfo, infoFriend, isFriend]);

  const handleDelete = async () => {
    const isConnected = await checkConnected();
    if (!isConnected) {
      Alert.alert("Không có kết nối", "Vui lòng kiểm tra và thử lại", [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    const rs = await deleteRequest(isFriend?.rId, userInfo);
    if (rs?.code === 1000) {
      setIsFriend((pre) => ({ ...pre, isFriend: false, isRQAF: false, isSRQAF: false }));
    } else if (rs?.code === 9998) {
      Alert.alert("Không phản hồi", `Phiên bản hết hiệu lực. Vui lòng thử lại.`, [
        {
          text: "Đóng",
        },
      ]);
      setIsLogin(false);
      setUserInfo({});
      return;
    } else {
      Alert.alert("Không phản hồi", result?.msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
  };

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
    const rs = await getPostById({ uid: userInfo?.id, page: pagination?.page + 1 }, userInfo); // gọi api
    setListPost((pre) => [...pre, rs?.data?.lData].flat()); // nối dữ liệu vào cái cũ
    setPagination(rs?.data?.pagination);
  }, [userInfo, pagination, isLogin]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={{ alignItems: `center` }}>
                {infoFriend?.backgroundImage ? (
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
                        uri: getStrapiMedia(infoFriend?.backgroundImage),
                      }}
                      style={{
                        width: `100%`,
                        height: 200,
                        backgroundColor: `#808080`,
                      }}
                    />
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
                {infoFriend?.avatar ? (
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
                        uri: getStrapiMedia(infoFriend?.avatar),
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 120,
                      }}
                    />
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
                <View style={{ position: `relative`, top: -60 }}>
                  <Text style={{ fontSize: 20, fontWeight: `500` }}>{infoFriend?.fullname}</Text>
                </View>
              </View>
              {!isFriend?.isFriend && (
                <View
                  style={{
                    position: `relative`,
                    top: -30,
                    flexDirection: `row`,
                    padding: 15,
                    backgroundColor: WHITE_COLOR,
                    borderTopWidth: 0.5,
                    borderTopColor: BORDER_BOTTOM_COLOR,
                  }}
                >
                  {showView()}
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
                        setDataUpdate(item);
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
                    <MIcon name={`dots-horizontal`} size={25} color={`#504d4d`} />
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

export default FriendInfo;
