import React, { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import FIcon from "react-native-vector-icons/FontAwesome";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useContextApp } from "../../ContextAPI";
import { WHITE_COLOR } from "../../shared/const";
import { getStrapiMedia, nextScreen, timeSince } from "../../shared/logic";
import { ACCOUNT_VIEW, FRIENDINFO_VIEW } from "../../shared/views";

const PostItem = ({ item, handleLike, setShowModal, setShowModalComment, navigation }) => {
  const { userInfo } = useContextApp();
  const handlePress = () => {
    if (item?.author?.id === userInfo?.id) return;
    nextScreen(navigation, FRIENDINFO_VIEW, { userId: item?.author?.id });
  };
  return (
    <View style={{ backgroundColor: WHITE_COLOR, marginBottom: 10 }}>
      <View style={{ flexDirection: `row`, justifyContent: `space-between`, padding: 10 }}>
        <Pressable onPress={handlePress}>
          {item?.author?.avatar ? (
            <Image
              source={{
                uri: getStrapiMedia(item?.author?.avatar),
              }}
              style={styles.postAvatar}
            />
          ) : (
            <View style={{ ...styles.postAvatar }} />
          )}
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: `500` }}>{item?.author?.fullname}</Text>
          <Text style={{ fontSize: 13, fontWeight: `400` }}>{timeSince(item?.created_at)}</Text>
        </View>
        <MIcon name={`dots-horizontal`} size={25} color={`#504d4d`} onPress={setShowModal} />
      </View>
      <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }}>
        {item?.content?.length > 0 && <Text style={{ marginBottom: 10 }}>{item?.content}</Text>}
        {item?.listImage?.map((image) => (
          <Image
            source={{ uri: getStrapiMedia(image?.image?.url) }}
            style={{ height: 300, resizeMode: "contain", marginBottom: 10 }}
            key={image?.id}
          />
        ))}
      </View>
      <View style={{ padding: 10, paddingTop: 0, flexDirection: `row` }}>
        <Pressable
          style={{ flexDirection: `row`, alignItems: `center` }}
          onPress={() => handleLike(item?.id)}
        >
          {item?.isUserLike ? (
            <FIcon name={`heart`} size={25} style={{ paddingRight: 7 }} color={`red`} />
          ) : (
            <FIcon name={`heart-o`} size={25} style={{ paddingRight: 7 }} color={`#333333`} />
          )}
          <Text style={{ fontSize: 17 }}>{item?.likeCount}</Text>
        </Pressable>
        <Pressable
          style={{ marginLeft: 20, flexDirection: `row`, alignItems: `center` }}
          onPress={setShowModalComment}
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
    </View>
  );
};

const styles = StyleSheet.create({
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: `#808080`,
  },
});

export default PostItem;
