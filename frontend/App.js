import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppRouter from "./src/config/router";
import ContextProvider from "./src/ContextAPI";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]);

const App = () => {
  return (
    <ContextProvider>
      <NavigationContainer>
        <AppRouter />
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
