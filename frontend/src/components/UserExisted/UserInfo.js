import React, { memo } from "react";
import { Image, Text, View } from "react-native";
import { TEXT_GRAY_COLOR } from "../../shared/const";
import { formatPhoneNumber, getStrapiMedia } from "../../shared/logic";

function UserInfo({ fullname, phonenumber, avatar }) {
  return (
    <View
      style={{
        marginBottom: 30,
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 70, height: 70, borderRadius: 500, backgroundColor: `#808080` }}
        source={{ uri: getStrapiMedia(avatar) }}
      />
      <Text style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: "500" }}>
        {fullname}
      </Text>
      <Text style={{ textAlign: "center", color: TEXT_GRAY_COLOR, marginTop: 5 }}>
        {formatPhoneNumber(phonenumber || "")}
      </Text>
    </View>
  );
}

export default memo(UserInfo);
