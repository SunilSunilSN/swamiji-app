import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./src/components/AppNavigator";
import Loader from "./src/components/Loader";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);

  // Renamed to navigateWithLoader
  const navigateWithLoader = (navigationFunc) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigationFunc();
    }, 800);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <NavigationContainer>
        <AppNavigator
          loading={loading}
          navigateWithLoader={navigateWithLoader} // updated prop
          setUserName={setUserName}
          userName={userName}
        />
      </NavigationContainer>
      <Loader visible={loading} />
    </View>
  );
}
