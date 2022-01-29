import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useContextApp } from "../ContextAPI";
import Account from "../screens/Auth/Account";
import Contact from "../screens/Auth/Contact";
import HomeView from "../screens/Auth/HomeView";
import Social from "../screens/Auth/Social";
import { BG_HEADER_COLOR, PRIMARY_COLOR, RED_COLOR, WHITE_COLOR } from "../shared/const";
import HeaderSearch from "./HeaderSearch";

const tabItem = [
  {
    name: "Tin nhắn",
    component: HomeView,
    activeTab: 0,
    nameIcon: "message1",
  },
  {
    name: "Danh bạ",
    component: Contact,
    activeTab: 1,
    nameIcon: "contacts",
  },
  {
    name: "Nhật kí",
    component: Social,
    activeTab: 3,
    nameIcon: "clockcircleo",
  },
  {
    name: "Tài khoản",
    component: Account,
    activeTab: 4,
    nameIcon: "user",
  },
];

const Tab = createBottomTabNavigator();
const Tabs = () => {
  const { searchInputFocus, setSearchInputFocus, totalMessageUnRead, totalRequest } =
    useContextApp();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: () => {
          return <HeaderSearch activeTab={activeTab} />;
        },
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: BG_HEADER_COLOR,
        },
        headerTitleStyle: {
          margin: 0,
        },
      }}
    >
      {tabItem.map((tab) => {
        const { name, activeTab, component, nameIcon } = tab;
        return (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            listeners={() => ({
              tabPress: () => {
                setActiveTab(activeTab);
                if (searchInputFocus) {
                  setSearchInputFocus(false);
                }
              },
            })}
            options={{
              tabBarIcon: ({ focused }) => {
                return (
                  <View>
                    <Icon
                      name={nameIcon}
                      color={focused ? PRIMARY_COLOR : "gray"}
                      size={focused ? 30 : 25}
                    />

                    {activeTab === 0 && totalMessageUnRead > 0 && (
                      <View style={styles.noteRead}>
                        <Text style={styles.notReadText}>
                          {totalMessageUnRead <= 5 ? totalMessageUnRead : `5+`}
                        </Text>
                      </View>
                    )}
                    {activeTab === 1 && totalRequest > 0 && (
                      <View style={styles.noteRead}>
                        <Text style={styles.notReadText}>
                          {totalRequest <= 5 ? totalRequest : `5+`}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              },
              tabBarActiveTintColor: PRIMARY_COLOR
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  noteRead: {
    position: "absolute",
    borderColor: WHITE_COLOR,
    borderWidth: 1,
    left: 0,
    top: 0,
    backgroundColor: RED_COLOR,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 20,
  },
  notReadText: {
    color: WHITE_COLOR,
    fontSize: 10,
    fontWeight: "600",
  },
});

export default memo(Tabs);
