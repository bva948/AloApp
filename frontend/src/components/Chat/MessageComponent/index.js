import React, { memo, useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useContextApp } from "../../../ContextAPI";
import { PRIMARY_COLOR } from "../../../shared/const";
import Message from "./Message";

const MessageComponent = ({
  messages = [],
  reciveUser,
  flatListMessage,
  loadMore,
  isLoadMore = false,
  navigation,
}) => {
  const { userInfo } = useContextApp();

  const reanderLoadMore = useCallback(() => {
    if (!isLoadMore) return null;
    return <ActivityIndicator size={"large"} color={PRIMARY_COLOR} style={{ marginTop: 10 }} />;
  }, [isLoadMore]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListMessage}
        data={messages}
        renderItem={({ item, index }) => (
          <Message
            message={item}
            isMe={parseInt(item?.senderId, 10) === userInfo?.id}
            isFirst={index === 0}
            reciveUser={reciveUser}
            nextMessage={messages[index + 1]}
            navigation={navigation}
          />
        )}
        inverted
        ListFooterComponent={reanderLoadMore}
        keyExtractor={(message) => message?.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e2e9f1",
    flex: 1,
  },
});
export default memo(MessageComponent);
