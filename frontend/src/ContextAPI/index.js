import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import { SERVICE_URL } from "../../services/base.services";
import { getCountRequest } from "../../services/contact.services";
import { isEmpty } from "../shared/logic";

export const Context = createContext();

export const useContextApp = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const socket = useRef();
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [totalMessageUnRead, setTotalMessageUnRead] = useState(0);
  const [messageUser, setMessageUser] = useState(); // thừa
  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [totalRequest, setTotalRequest] = useState(0);
  const [postData, setPostData] = useState();
  const [postDataAccount, setPostDataAccount] = useState();

  useEffect(() => { // lấy danh sách kết bạn khi đăng nhập thành công
    if (isEmpty(userInfo)) return;
    const getC = async () => {
      const rs = await getCountRequest({ uid: userInfo?.id }, userInfo);
      if (rs?.code === 1000) {
        setTotalRequest(rs?.data);
      }
    };
    getC();
  }, [userInfo]);

  useEffect(() => {
    // kết nối đến socket sv khi đăng nhập và ngắt kết nối khi đăng xuất
    if (isLogin) {
      socket.current = io(SERVICE_URL);
    } else {
      socket?.current?.disconnect();
    }
  }, [isLogin]);

  useEffect(() => {
    // chạy khi kết nối với socket server thành công
    const getRQAF = (data) => { // 
      if (!isEmpty(data)) {
        setTotalRequest((pre) => pre + 1);
      }
    };
    const logout = (logout = false) => {
      if (!logout) return;
      setIsLogin(false); // cho đăng xuất
      setUserInfo({}); // thông tin người dùng bằng null
      Alert.alert(
        "Phiên bản hết hiệu lực",
        "Bạn đang đăng nhập trên thiết bị khác. Nếu không phải bạn hãy nhanh chóng thay đổi mật khẩu.",
        [
          {
            text: "Đóng",
          },
        ]
      );
    };
    if (!socket?.current) return;
    if (userInfo?.id) {
      socket?.current?.emit(`addUser`, userInfo?.id);
    }
    socket?.current?.on(`getRequestAddFriend`, getRQAF); // lắng nghe sự kiện gửi yêu cầu kết bạn
    socket?.current?.on(`otherDevice`, logout); // lắng nghe sự kiện đăng nhập thiết bị khác
    return async () => {
      // xoá bỏ các sự kiện khi mà hàm useEffect chạy lại => tránh bị xung đọto
      await socket?.current?.off(`getRequestAddFriend`, getRQAF);
      await socket?.current?.off(`otherDevice`, logout);
      await socket?.current?.off(`addUser`);
    };
  }, [socket?.current, userInfo?.id]);

  const value = useMemo(
    () => ({
      isLogin,
      setIsLogin,
      searchInputFocus,
      setSearchInputFocus,
      userInfo,
      setUserInfo,
      messageUser,
      setMessageUser,
      socket,
      setTotalMessageUnRead,
      totalMessageUnRead,
      totalRequest,
      setTotalRequest,
      postData,
      setPostData,
      postDataAccount,
      setPostDataAccount,
    }),
    [
      isLogin,
      searchInputFocus,
      userInfo,
      messageUser,
      socket,
      totalMessageUnRead,
      totalRequest,
      postData,
      postDataAccount,
    ]
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
