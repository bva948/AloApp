import React, { memo } from "react";
import { View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import Description from "../../components/UserExisted/Description";
import GoToLogin from "../../components/UserExisted/GoToLogin";
import UserInfo from "../../components/UserExisted/UserInfo";

const UserExisted = ({ route, navigation }) => {
  const {
    user: { fullname, avatar },
    phonenumber,
  } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View
        style={{
          marginTop: 30,
          maxWidth: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Description phonenumber={phonenumber} />
        <UserInfo phonenumber={phonenumber} fullname={fullname} avatar={avatar} />
        <GoToLogin phonenumber={phonenumber} fullname={fullname} navigation={navigation} />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 20, alignItems: "center" }}>
        <CustomButton
          title={"Dùng số điện thoại khác"}
          handlePress={() => navigation.goBack()}
          padding={15}
        />
      </View>
    </View>
  );
};

export default memo(UserExisted);
