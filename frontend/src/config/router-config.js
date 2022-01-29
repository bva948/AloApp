import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Tabs from "../navigation/Tabs";
import Account from "../screens/Auth/Account";
import AccountInfo from "../screens/Auth/AccountInfo";
import AccountSetting from "../screens/Auth/AccountSetting";
import AddFriend from "../screens/Auth/AddFriend";
import AddFriendRequest from "../screens/Auth/AddFriendRequest";
import ChangeInfo from "../screens/Auth/ChangeInfo";
import ChangePassword from "../screens/Auth/ChangePassword";
import ChatRoom from "../screens/Auth/ChatRoom";
import Contact from "../screens/Auth/Contact";
import FriendInfo from "../screens/Auth/FriendInfo";
import HomeView from "../screens/Auth/HomeView";
import Modal from "../screens/Auth/Modal";
import RequestAddFriend from "../screens/Auth/RequestAddFriend";
import Social from "../screens/Auth/Social";
import Home from "../screens/NotAuth";
import ConfirmAccount from "../screens/NotAuth/ConfirmAccount";
import CreateAccount from "../screens/NotAuth/CreateAccount";
import ForgotPassword from "../screens/NotAuth/ForgotPassword";
import Login from "../screens/NotAuth/Login";
import NewPassword from "../screens/NotAuth/NewPassword";
import Register from "../screens/NotAuth/Register";
import UserExisted from "../screens/NotAuth/UserExisted";
import { WHITE_COLOR } from "../shared/const";
import {
  ACCOUNTSETTING_VIEW,
  ACCOUNT_INFO_VIEW,
  ACCOUNT_VIEW,
  ADDFRIENDREQUEST_VIEW,
  ADDFRIEND_VIEW,
  CHANGE_INFO_VIEW,
  CHANGE_PASSWORD_VIEW,
  CHATROOM_VIEW,
  CONFIRMACCOUNT_VIEW,
  CONTACT_VIEW,
  CREATEACCOUNT_VIEW,
  FORGOTPASSWORD_VIEW,
  FRIENDINFO_VIEW,
  HOME_VIEW,
  LOGIN_VIEW,
  MODAL_VIEW,
  NEWPASSWORD_VIEW,
  REGISTER_VIEW,
  REQUESTADDFRIEND_VIEW,
  SOCIAL_VIEW,
  USEREXISTED_VIEW,
} from "../shared/views";

export const options = (title) => ({
  headerTitle: (props) => (
    <View style={{ justifyContent: "center" }}>
      <Text
        numberOfLines={1}
        style={{
          fontWeight: "400",
          fontSize: 18,
          color: WHITE_COLOR,
          maxWidth: 200,
          textAlign: "center",
        }}
      >
        {title || props.children}
      </Text>
    </View>
  ),
});

export const AuthenRouter = [
  {
    name: HOME_VIEW,
    Component: (HomeView, Tabs),
  },
  {
    name: CHATROOM_VIEW,
    Component: ChatRoom,
    options: {
      headerTitle: (props) => (
        <View style={{ justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: "400",
              fontSize: 18,
              color: WHITE_COLOR,
              maxWidth: 200,
              textAlign: "center",
            }}
          >
            {props.children}
          </Text>
        </View>
      ),
      headerShown: true,
      headerRight: () => (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Icon
            name="bars"
            size={25}
            color={WHITE_COLOR}
            style={{ position: "relative", bottom: -1 }}
          />
        </View>
      ),
    },
  },
  {
    name: CONTACT_VIEW,
    Component: (Contact, Tabs),
  },
  {
    name: SOCIAL_VIEW,
    Component: (Social, Tabs),
  },
  {
    name: ACCOUNT_VIEW,
    Component: (Account, Tabs),
  },
  {
    name: ADDFRIEND_VIEW,
    Component: AddFriend,
    options: {
      headerShown: true,
      ...options("Thêm bạn"),
    },
  },
  {
    name: ADDFRIENDREQUEST_VIEW,
    Component: AddFriendRequest,
    options: {
      headerShown: true,
      ...options("Lời mời kết bạn"),
    },
  },
  {
    name: ACCOUNTSETTING_VIEW,
    Component: AccountSetting,
    options: {
      headerShown: true,
      ...options("Cài đặt"),
    },
  },
  {
    name: MODAL_VIEW,
    Component: Modal,
    options: {
      headerShown: false,
      animation: "slide_from_bottom",
    },
  },
  {
    name: ACCOUNT_INFO_VIEW,
    Component: AccountInfo,
    options: {
      headerShown: true,
      ...options("Thông tin cá nhân"),
    },
  },
  {
    name: CHANGE_INFO_VIEW,
    Component: ChangeInfo,
    options: {
      headerShown: true,
      ...options("Thông tin cá nhân"),
      animation: "slide_from_bottom",
    },
  },
  {
    name: CHANGE_PASSWORD_VIEW,
    Component: ChangePassword,
    options: {
      headerShown: true,
      ...options("Đổi mật khẩu"),
    },
  },
  {
    name: REQUESTADDFRIEND_VIEW,
    Component: RequestAddFriend,
    options: {
      headerShown: true,
      ...options("Yêu cầu kết bạn"),
    },
  },
  {
    name: FRIENDINFO_VIEW,
    Component: FriendInfo,
    options: {
      headerTitle: (props) => (
        <View style={{ justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: "400",
              fontSize: 18,
              color: WHITE_COLOR,
              maxWidth: 200,
              textAlign: "center",
            }}
          >
            {props.children}
          </Text>
        </View>
      ),
      headerShown: true,
    },
  },
];

export const NotAuthenRouter = [
  {
    name: "HomeView",
    Component: Home,
    options: {
      headerShown: false,
    },
  },
  {
    name: LOGIN_VIEW,
    Component: Login,
    options: options("Đăng nhập"),
  },
  {
    name: REGISTER_VIEW,
    Component: Register,
    options: options("Tạo tài khoản"),
  },
  {
    name: CREATEACCOUNT_VIEW,
    Component: CreateAccount,
    options: options("Tạo tài khoản"),
  },
  {
    name: USEREXISTED_VIEW,
    Component: UserExisted,
    options: options("Xác nhận tài khoản"),
  },
  {
    name: CONFIRMACCOUNT_VIEW,
    Component: ConfirmAccount,
    options: options("Xác nhận tài khoản"),
  },
  {
    name: FORGOTPASSWORD_VIEW,
    Component: ForgotPassword,
    options: options("Lấy lại mật khẩu"),
  },
  {
    name: NEWPASSWORD_VIEW,
    Component: NewPassword,
    options: options("Lấy lại mật khẩu"),
  },
];
