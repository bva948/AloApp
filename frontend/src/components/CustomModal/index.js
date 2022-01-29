import React, { memo } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { TEXT_GRAY_COLOR, WHITE_COLOR, BORDER_BOTTOM_COLOR } from "../../shared/const";
import AIcon from "react-native-vector-icons/AntDesign";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomModal = ({ showModal, setShowModal, handleDelete, handleEdit }) => {
  return (
    <Modal visible={showModal} animationType="slide" transparent={true} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: `#8e8e8e61`,
        }}
      >
        <Pressable
          style={{
            flex: 1,
          }}
          onPress={() => setShowModal(false)}
        />
        <View
          style={{
            backgroundColor: WHITE_COLOR,
            padding: 10,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <Pressable style={{ flexDirection: `row`, alignItems: `center` }} onPress={handleEdit}>
            <AIcon name={`edit`} size={30} color={TEXT_GRAY_COLOR} style={{ paddingRight: 15 }} />
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                paddingBottom: 20,
                borderBottomWidth: 0.5,
                borderBottomColor: BORDER_BOTTOM_COLOR,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "400" }}>Chỉnh sửa bài đăng</Text>
            </View>
          </Pressable>
          <Pressable style={{ flexDirection: `row`, alignItems: `center` }} onPress={handleDelete}>
            <MIcon
              name={`delete-outline`}
              size={30}
              color={TEXT_GRAY_COLOR}
              style={{ paddingRight: 15 }}
            />
            <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}>
              <Text style={{ fontSize: 15, fontWeight: "400" }}>Xoá bài đăng</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default memo(CustomModal);
