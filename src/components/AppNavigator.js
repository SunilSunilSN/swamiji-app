import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
const Drawer = createDrawerNavigator();

// Custom Drawer
function CustomDrawerContent({
  navigation,
  state,
  descriptors,
  userName,
  setUserName,
}) {
  const isDrawerOpen = useDrawerStatus() === "open";

  const slideAnims = useRef(
    state.routes.map(() => new Animated.Value(-50))
  ).current;
  const fadeAnims = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (isDrawerOpen) {
      const animations = state.routes.map((_, i) =>
        Animated.parallel([
          Animated.timing(slideAnims[i], {
            toValue: 0,
            duration: 400,
            delay: i * 120,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnims[i], {
            toValue: 1,
            duration: 400,
            delay: i * 120,
            useNativeDriver: true,
          }),
        ])
      );
      Animated.stagger(80, animations).start();
    } else {
      state.routes.forEach((_, i) => {
        slideAnims[i].setValue(-50);
        fadeAnims[i].setValue(0);
      });
    }
  }, [isDrawerOpen]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setUserName(null);
          navigation.navigate("Home");
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {/* Header with Welcome + Login button */}
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerUsername}>
            {userName ? `Hello, ${userName}!` : "Welcome!"}
          </Text>

          {!userName && (
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: "#800000",
                paddingVertical: responsiveHeight(1.2),
                paddingHorizontal: responsiveWidth(4),
                borderRadius: responsiveWidth(2),
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: RFValue(14),
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Drawer Items */}
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { title, drawerLabel } = descriptors[route.key].options;

          // Skip Login screen from drawer list
          if (route.name === "Login" || route.name === "Registration")
            return null;

          let iconName = "ellipse-outline";
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "About")
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";

          return (
            <Animated.View
              key={route.key}
              style={{
                transform: [{ translateX: slideAnims[index] }],
                opacity: fadeAnims[index],
              }}
            >
              <DrawerItem
                label={drawerLabel ?? title ?? route.name}
                focused={focused}
                onPress={() => navigation.navigate(route.name)}
                labelStyle={{
                  fontSize: 16,
                  fontWeight: focused ? "bold" : "normal",
                  color: focused ? "#800000" : "#555",
                }}
                style={{
                  backgroundColor: focused ? "#ffe6e6" : "transparent",
                  borderRadius: 8,
                  marginHorizontal: 8,
                }}
                icon={({ size }) => (
                  <Ionicons name={iconName} size={size} color="#800000" />
                )}
              />
            </Animated.View>
          );
        })}
      </DrawerContentScrollView>

      {/* Logout pinned at bottom */}
      {userName && (
        <View style={{ marginBottom: 40 }}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            labelStyle={{ fontSize: 16, fontWeight: "bold", color: "#800000" }}
            style={{
              backgroundColor: "#ffe6e6",
              borderRadius: 8,
              marginHorizontal: 8,
            }}
            icon={({ size }) => (
              <Ionicons name="log-out-outline" size={size} color="#800000" />
            )}
          />
        </View>
      )}
    </View>
  );
}

export const AppNavigator = ({ userName, setUserName, navigateWithLoader }) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#800000",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          borderBottomWidth: 0,
        }, // remove bottom border },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          userName={userName}
          setUserName={setUserName}
        />
      )}
    >
      <Drawer.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            navigateWithLoader={navigateWithLoader} // ✅ loader here
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen name="About">
        {(props) => (
          <AboutScreen
            {...props}
            setUserName={setUserName}
            navigateWithLoader={navigateWithLoader}
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            setUserName={setUserName} // ✅ update global name
            navigateWithLoader={navigateWithLoader}
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen name="Registration">
        {(props) => (
          <RegistrationScreen
            {...props}
            navigateWithLoader={navigateWithLoader}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: "row", // row layout
    justifyContent: "space-between", // push Welcome and Login to sides
    alignItems: "center",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  drawerUsername: {
    color: "#800000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
