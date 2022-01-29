import React, { memo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import CustomButton from "../../components/customs/CustomButton";
import { PRIMARY_COLOR, SECONDARY_COLOR, TEXT_BLACK_COLOR, WHITE_COLOR } from "../../shared/const";
import { nextScreen } from "../../shared/logic";
import { LOGIN_VIEW, REGISTER_VIEW } from "../../shared/views";

const Home = ({ navigation }) => {
  const handlePress = (next) => {
    nextScreen(navigation, next);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SwiperFlatList
          index={0}
          showPagination
          paginationStyleItem={{
            width: 10,
            height: 10,
          }}
          paginationStyleItemActive={{ backgroundColor: PRIMARY_COLOR }}
        >
          <View style={[styles.child]}>
            <Text style={styles.text}>Zalo</Text>
          </View>
          <View style={[styles.child]}>
            <Text style={styles.text}>Zalo</Text>
          </View>
          <View style={[styles.child]}>
            <Text style={styles.text}>Zalo</Text>
          </View>
          <View style={[styles.child]}>
            <Text style={styles.text}>Zalo</Text>
          </View>
        </SwiperFlatList>
      </View>
      <View style={styles.container}>
        <CustomButton
          title={"Đăng nhập"}
          handlePress={() => handlePress(LOGIN_VIEW)}
          padding={15}
        />
        <CustomButton
          title={"Đăng ký"}
          handlePress={() => handlePress(REGISTER_VIEW)}
          backgroundColor={SECONDARY_COLOR}
          textStyle={TEXT_BLACK_COLOR}
          padding={15}
        />
      </View>
    </View>
  );
};

export default memo(Home);

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 110,
  },
  child: {
    width,
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 150,
    fontWeight: "600",
    textAlign: "center",
    color: PRIMARY_COLOR,
  },
});
