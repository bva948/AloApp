import React, { useMemo } from "react";
import { FlatList, Pressable, Text } from "react-native";
import { View } from "react-native";
import { BORDER_BOTTOM_COLOR, GREEN_COLOR } from "../../shared/const";
import IonIcon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useContextApp } from "../../ContextAPI";
import { logout } from "../../../services/user.services";
import { nextScreen } from "../../shared/logic";
import { useNavigation } from "@react-navigation/native";
import { ACCOUNT_INFO_VIEW, CHANGE_PASSWORD_VIEW, REQUESTADDFRIEND_VIEW } from "../../shared/views";

const AccountSetting = () => {
  const { setIsLogin, setUserInfo, socket, userInfo } = useContextApp();
  const navigation = useNavigation();
  const menuConfig = useMemo(
    () => [
      {
        id: 1,
        name: `Thông tin tài khoản`,
        icon: <AntIcon name={`user`} size={25} style={{ marginRight: 15 }} color={`#1E90FF`} />,
        onClick: () => {
          nextScreen(navigation, ACCOUNT_INFO_VIEW);
        },
      },
      {
        id: 2,
        name: `Đổi mật khẩu`,
        icon: (
          <MaterialIcon
            name={`security`}
            size={25}
            style={{ marginRight: 15 }}
            color={GREEN_COLOR}
          />
        ),
        onClick: () => {
          nextScreen(navigation, CHANGE_PASSWORD_VIEW);
        },
      },
      {
        id: 3,
        name: `Yêu cầu kết bạn`,
        icon: <AntIcon name={`adduser`} size={25} style={{ marginRight: 15 }} color={`#FF6347`} />,
        onClick: () => {
          nextScreen(navigation, REQUESTADDFRIEND_VIEW);
        },
      },
      {
        id: 4,
        name: `Đăng xuất`,
        icon: (
          <IonIcon
            name={`log-out-outline`}
            size={25}
            style={{ marginRight: 15 }}
            color={`#696969`}
          />
        ),
        onClick: () => {
          setIsLogin(false);
          setUserInfo({});
        },
      },
    ],
    []
  );
  return (
    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
      <FlatList
        data={menuConfig}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              style={{
                paddingBottom: 12,
                paddingTop: 12,
                borderBottomWidth: 0.5,
                borderBottomColor: BORDER_BOTTOM_COLOR,
                flexDirection: `row`,
                alignItems: `center`,
              }}
              onPress={item?.onClick}
            >
              {item?.icon}
              <Text style={{ fontSize: 16 }}>{item?.name}</Text>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item?.id + item?.name}
      />
    </View>
  );
};

export default AccountSetting;
