import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { useContextApp } from "../ContextAPI";
import NoThing from "../screens/NoThing";
import { PRIMARY_COLOR, WHITE_COLOR } from "../shared/const";
import { HOME_VIEW } from "../shared/views";
import { AuthenRouter, NotAuthenRouter } from "./router-config";

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const { isLogin } = useContextApp();
  const [routerConfig, setRouterConfig] = useState([]);
  useEffect(() => {
    getConfig();
  }, [isLogin]);
  const getConfig = async () => setRouterConfig(isLogin ? AuthenRouter : NotAuthenRouter);
  const renderRouter = useCallback(() => {
    if (routerConfig.length === 0) return null;
    const ui = routerConfig.map((router, index) => {
      const { name, Component, options } = router;
      return <Stack.Screen key={index} name={name} component={Component} options={options} />;
    });
    return ui;
  }, [routerConfig]);

  if (routerConfig.length === 0) return <NoThing />;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: PRIMARY_COLOR,
        },
        headerShown: isLogin ? false : true,
        headerBackTitleVisible: false,
        headerTintColor: WHITE_COLOR,
      }}
      initialRouteName={HOME_VIEW}
    >
      {renderRouter()}
    </Stack.Navigator>
  );
};

export default AppRouter;
