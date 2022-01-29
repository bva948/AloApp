import React, { memo } from "react";
import { Text, View } from "react-native";
import { formatPhoneNumber } from "../../shared/logic";

const Description = ({ phonenumber }) => {
  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", alignItems: "center" }}>
        Đã tồn tại 1 tài khoản Zalo được gắn với số điện thoại
      </Text>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", alignItems: "center" }}>
        {formatPhoneNumber(phonenumber || "")}
      </Text>
    </View>
  );
};

export default memo(Description);
