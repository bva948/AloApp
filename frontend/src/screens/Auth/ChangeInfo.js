import React, { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../../components/customs/CustomButton";
import CustomTextInput from "../../components/customs/CustomTextInput";
import { useContextApp } from "../../ContextAPI";
import {
  BORDER_BOTTOM_COLOR,
  PRIMARY_COLOR,
  TEXT_GRAY_COLOR,
  WHITE_COLOR,
} from "../../shared/const";
import Icon from "react-native-vector-icons/Ionicons";
import AIcon from "react-native-vector-icons/AntDesign";
import EIcon from "react-native-vector-icons/Entypo";
import {
  containNumber,
  containSpecificCharacter,
  dateFullFormat,
  isEmpty,
} from "../../shared/logic";
import DismissKeyBoard from "../../components/DismissKeyBoard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateUserInfo } from "../../../services/user.services";

const ChangeInfo = ({ navigation }) => {
  const { userInfo, setUserInfo } = useContextApp();
  const [fullname, setFullname] = useState("");
  const [disable, setDisable] = useState(true);
  const [sex, setSex] = useState(true);
  const [fullnameFocus, setFullnameFocus] = useState(false);
  const [date, setDate] = useState(new Date(2000, 10, 15));
  const [dateTmp, setDateTmp] = useState(new Date(2000, 10, 15));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isEmpty(userInfo)) return;
    setFullname(userInfo?.fullname);
    setSex(userInfo?.sex);
    if (userInfo?.birthday) {
      setDate(userInfo?.birthday || new Date(2000, 10, 15));
      setDateTmp(new Date(userInfo?.birthday));
    }
  }, [userInfo]);

  const handleUpdate = useCallback(async () => {
    let msg;
    if (containSpecificCharacter(fullname)) {
      msg = "Tên không được chứa kí tự đặc biệt.";
    }
    if (containNumber(fullname)) {
      msg = "Tên không được chứa chữ số.";
    }
    const nameLength = fullname.length;
    if (nameLength < 2 || nameLength > 40) {
      msg = `${nameLength < 2 ? "Tên quá ngắn" : "Tên quá dài"}. Tên hợp lệ phải gồm 2-40 ký tự.`;
    }
    if (msg) {
      Alert.alert("Lỗi", msg, [
        {
          text: "Đóng",
        },
      ]);
      return;
    }
    setDisable(true);
    const data = {
      sex,
      fullname,
      birthday: date,
    };
    const rs = await updateUserInfo(userInfo?.id, data);
    setDisable(false);
    if (!isEmpty(rs)) {
      const newData = { ...userInfo, fullname: rs?.fullname, sex: rs?.sex, birthday: rs?.birthday };
      setUserInfo(newData);
      navigation.pop();
    } else {
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình thực hiện. Vui lòng thử lại sau.", [
        {
          text: "Đóng",
        },
      ]);
    }
  }, [sex, date, fullname, userInfo]);

  return (
    <DismissKeyBoard>
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: WHITE_COLOR, paddingLeft: 10, paddingRight: 10 }}>
          <CustomTextInput
            placeholder="Họ và tên"
            inputValue={fullname}
            onChangeText={(value) => {
              setFullname(value);
              setDisable(false);
            }}
            textInputStyle={{ width: `100%`, fontSize: 18 }}
            viewStyle={{
              paddingTop: 15,
              paddingBottom: 15,
              borderBottomWidth: 0.5,
              borderBottomColor: BORDER_BOTTOM_COLOR,
              justifyContent: "center",
            }}
            onFocus={() => setFullnameFocus(true)}
            onBlur={() => setFullnameFocus(false)}
          >
            <View
              style={{
                position: "absolute",
                right: 0,
                padding: 5,
                alignItems: "center",
                flexDirection: `row`,
              }}
            >
              {fullnameFocus && fullname.length > 0 && (
                <Icon name="close-outline" color="gray" size={20} onPress={() => setFullname("")} />
              )}
              <EIcon name="edit" size={14} color={TEXT_GRAY_COLOR} style={{ marginLeft: 10 }} />
            </View>
          </CustomTextInput>
          <View style={styles.row}>
            <Pressable
              style={{ flexDirection: `row`, alignItems: `center`, marginRight: 50 }}
              onPress={() => {
                setSex(true);
                setDisable(false);
              }}
            >
              <View
                style={[
                  styles.circle,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: sex ? PRIMARY_COLOR : WHITE_COLOR,
                    borderColor: sex ? PRIMARY_COLOR : BORDER_BOTTOM_COLOR,
                  },
                ]}
              >
                {sex && <AIcon name="check" color={WHITE_COLOR} />}
              </View>
              <Text>Nam</Text>
            </Pressable>
            <Pressable
              style={{ flexDirection: `row`, alignItems: `center` }}
              onPress={() => {
                setSex(false);
                setDisable(false);
              }}
            >
              <View
                style={[
                  styles.circle,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: sex ? WHITE_COLOR : PRIMARY_COLOR,
                    borderColor: sex ? BORDER_BOTTOM_COLOR : PRIMARY_COLOR,
                  },
                ]}
              >
                {!sex && <AIcon name="check" color={WHITE_COLOR} />}
              </View>
              <Text>Nữ</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.row, { justifyContent: "space-between" }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={{ fontSize: 18 }}>{dateFullFormat(date)}</Text>
            <EIcon name="edit" size={14} color={TEXT_GRAY_COLOR} style={{ marginLeft: 10 }} />
          </Pressable>
        </View>
        <View style={{ justifyContent: `center`, alignItems: `center`, marginTop: 15 }}>
          <CustomButton
            title={`Cập nhật`}
            width="70%"
            padding={12}
            handlePress={handleUpdate}
            disabled={disable}
          />
        </View>
        {showModal && (
          <>
            {Platform.OS === `ios` ? (
              <Modal visible={true} animationType="slide" transparent={true} style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: WHITE_COLOR,
                      paddingTop: 15,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 16 }} onPress={() => setShowModal(false)}>
                      Huỷ
                    </Text>
                    <Text style={{ fontSize: 20 }}>Ngày sinh</Text>
                    <Pressable
                      style={{ flexDirection: "row", alignItems: "center" }}
                      onPress={() => {
                        setShowModal(false);
                        setDate(dateTmp);
                        setDisable(false);
                      }}
                    >
                      <AIcon name="check" color={PRIMARY_COLOR} size={25} />
                      <Text style={{ fontSize: 16, marginLeft: 5 }}>Xong</Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      backgroundColor: WHITE_COLOR,
                      padding: 10,
                    }}
                  >
                    <DateTimePicker
                      testID="dateTimePicker"
                      mode={"date"}
                      display="default"
                      onChange={(event, selectedDate) => setDateTmp(selectedDate)}
                      value={dateTmp}
                      locale="vi"
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                testID="dateTimePicker"
                mode={"date"}
                display="default"
                onChange={(event, selectedDate) => {
                  if (!selectedDate) {
                    setShowModal(false);
                    return;
                  }
                  setDateTmp(selectedDate);
                  setShowModal(false);
                  setDate(selectedDate);
                  setDisable(false);
                }}
                value={dateTmp}
                locale="vi"
              />
            )}
          </>
        )}
      </View>
    </DismissKeyBoard>
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
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: BORDER_BOTTOM_COLOR,
    marginRight: 5,
  },
  textGrey: {
    fontSize: 15,
    color: TEXT_GRAY_COLOR,
  },
});
export default ChangeInfo;
