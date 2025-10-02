import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert, Animated } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import { useDrawerStatus } from "@react-navigation/drawer";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content to display username
function CustomDrawerContent({ navigation, state, descriptors, userName }) {
  const isDrawerOpen = useDrawerStatus() === "open";

  // Animations
  const slideAnims = useRef(
    state.routes.map(() => new Animated.Value(-50))
  ).current;
  const fadeAnims = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  const logoutSlide = useRef(new Animated.Value(-50)).current;
  const logoutFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      const animations = state.routes.map((_, i) =>
        Animated.parallel([
          Animated.timing(slideAnims[i], {
            toValue: 0,
            duration: 400,
            delay: i * 150,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnims[i], {
            toValue: 1,
            duration: 400,
            delay: i * 150,
            useNativeDriver: true,
          }),
        ])
      );
      animations.push(
        Animated.parallel([
          Animated.timing(logoutSlide, {
            toValue: 0,
            duration: 400,
            delay: state.routes.length * 150,
            useNativeDriver: true,
          }),
          Animated.timing(logoutFade, {
            toValue: 1,
            duration: 400,
            delay: state.routes.length * 150,
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
      logoutSlide.setValue(-50);
      logoutFade.setValue(0);
    }
  }, [isDrawerOpen]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerUsername}>Hello, {userName}!</Text>
        </View>

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { title, drawerLabel } = descriptors[route.key].options;
          let iconName;
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
                icon={({ size, color }) => (
                  <Ionicons name={iconName} size={size} color={"#800000"} />
                )}
              />
            </Animated.View>
          );
        })}
      </DrawerContentScrollView>

      {/* Logout pinned at bottom */}
      <Animated.View
        style={{
          transform: [{ translateX: logoutSlide }],
          opacity: logoutFade,
          marginBottom: 50, // spacing from bottom
        }}
      >
        <DrawerItem
          label="Logout"
          onPress={handleLogout}
          labelStyle={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#800000",
          }}
          style={{
            backgroundColor: "#ffe6e6", // remove active highlight
            borderRadius: 8,
            marginHorizontal: 8,
          }}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#800000" />
          )}
        />
      </Animated.View>
    </View>
  );
}
// Drawer navigator for Home & About
function DrawerNavigator({ route, navigateWithLoader }) {
  const userName = route?.params?.userName || "UserAppp";

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#800000", },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} userName={userName} />
      )}
    >
      <Drawer.Screen name="Home" initialParams={{ userName }}>
        {(props) => (
          <HomeScreen {...props} navigateWithLoader={navigateWithLoader} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="About" initialParams={{ userName }}>
        {(props) => (
          <AboutScreen {...props} navigateWithLoader={navigateWithLoader} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

// Main Stack navigator
export const AppNavigator = ({ navigateWithLoader, userName, setUserName }) => {
  return (
    <Stack.Navigator>
      {/* Login & Registration (no header) */}
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => (
          <LoginScreen
            {...props}
            navigateWithLoader={navigateWithLoader}
            setUserName={setUserName}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Registration" options={{ headerShown: false }}>
        {(props) => (
          <RegistrationScreen
            {...props}
            navigateWithLoader={navigateWithLoader}
            setUserName={setUserName}
          />
        )}
      </Stack.Screen>

      {/* Drawer (Home & About) */}
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {(props) => (
          <DrawerNavigator
            {...props}
            navigateWithLoader={navigateWithLoader}
            userName={userName}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
const styles = StyleSheet.create({
  drawerHeader: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  drawerUsername: {
    color: "#800000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
