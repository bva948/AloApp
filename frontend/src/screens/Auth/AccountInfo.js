import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  PRIMARY_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import { dateFullFormat, formatPhoneNumber, nextScreen } from "../../shared/logic";
import { CHANGE_INFO_VIEW } from "../../shared/views";

const AccountInfo = ({ navigation }) => {
  const { userInfo } = useContextApp();
  return (
    <>
      <View style={{ padding: 10, paddingTop: 0, paddingBottom: 0, backgroundColor: WHITE_COLOR }}>
        <View style={styles.row}>
          <Text style={styles.label}>Họ và tên</Text>
          <Text style={styles.textGrey}>{userInfo?.fullname}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Giới tính</Text>
          <Text style={styles.textGrey}>{userInfo?.sex ? "Nam" : "Nữ"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text style={styles.textGrey}>{dateFullFormat(userInfo?.birthday)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Điện thoại</Text>
          <Text style={styles.phonenumber}>{formatPhoneNumber(userInfo?.phonenumber)}</Text>
        </View>
      </View>
      <View style={{ justifyContent: `center`, alignItems: `center`, marginTop: 15 }}>
        <CustomButton
          title={`Đổi thông tin`}
          width="90%"
          padding={12}
          handlePress={() => nextScreen(navigation, CHANGE_INFO_VIEW)}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: `row`,
    borderBottomWidth: 0.5,
    alignItems: `center`,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingTop: 15,
    paddingBottom: 15,
  },
  label: {
    fontSize: 15,
    width: 100,
  },
  phonenumber: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: "400",
  },
  textGrey: {
    fontSize: 15,
    color: TEXT_GRAY_COLOR,
  },
});

export default AccountInfo;
