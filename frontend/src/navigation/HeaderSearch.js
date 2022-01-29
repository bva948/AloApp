import { useNavigation } from "@react-navigation/core";
import React, { memo, useCallback, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import CustomTextInput from "../components/customs/CustomTextInput";
import { useContextApp } from "../ContextAPI";
import { BLACK_COLOR, TEXT_GRAY_COLOR, WHITE_COLOR } from "../shared/const";
import { nextScreen } from "../shared/logic";
import { ACCOUNTSETTING_VIEW, ADDFRIEND_VIEW } from "../shared/views";

const HeaderSearch = ({ activeTab }) => {
  const { searchInputFocus, setSearchInputFocus } = useContextApp();
  const navigation = useNavigation();
  const [textSearch, setTextSearch] = useState("");
  const searchInput = useRef();
  const handleTabs = useCallback(() => {
    switch (activeTab) {
      case 0:
        return "plus";
      case 1:
        return "adduser";
      case 2:
        return "qrcode";
      case 3:
        return "bells";
      case 4:
        return "setting";
    }
  }, [activeTab]);

  const handlePress = useCallback(() => {
    if (activeTab === 1) {
      nextScreen(navigation, ADDFRIEND_VIEW);
    } else if (activeTab === 4) {
      nextScreen(navigation, ACCOUNTSETTING_VIEW);
    }
  }, [activeTab]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 2,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            width: 30,
            justifyContent: "center",
            marginRight: 10,
          }}
          onPress={() => {
            if (searchInputFocus) {
              setSearchInputFocus(false);
              searchInput?.current.blur();
            } else {
              searchInput?.current.focus();
              setSearchInputFocus(true);
            }
          }}
        >
          <AntDesignIcon
            name={searchInputFocus ? "left" : "search1"}
            color={WHITE_COLOR}
            size={25}
          />
        </TouchableOpacity>
        <CustomTextInput
          placeholder="Tìm bạn bè, tin nhắn..."
          viewStyle={{
            paddingLeft: 5,
            alignItems: "stretch",
            justifyContent: "center",
            borderRadius: 10,
            width: 500,
            maxWidth: "80%",
            position: "relative",
          }}
          placeholderTextColor={searchInputFocus ? TEXT_GRAY_COLOR : `#ebeaea`}
          textInputStyle={{
            fontSize: 16,
            padding: 5,
            paddingRight: 30,
            borderRadius: 5,
            backgroundColor: searchInputFocus ? "#ffffff" : null,
            color: BLACK_COLOR,
          }}
          onChangeText={(value) => setTextSearch(value)}
          inputRef={searchInput}
          // onBlur={() => setSearchInputFocus(false)}
          onFocus={() => setSearchInputFocus(true)}
          inputValue={textSearch}
        >
          {textSearch.length > 0 && (
            <AntDesignIcon
              name="closecircle"
              size={15}
              style={{ position: "absolute", right: 0, padding: 5 }}
              color={"#0c0d0e87"}
              onPress={() => setTextSearch("")}
            />
          )}
        </CustomTextInput>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity>
          <AntDesignIcon name={handleTabs()} color="white" size={25} onPress={handlePress} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(HeaderSearch);
