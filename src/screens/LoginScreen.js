import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/LoginStyle";
import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import Loader from "../components/Loader";
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
const { height } = Dimensions.get("window");
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useIsFocused } from "@react-navigation/native";
export default function LoginScreen({
  navigation,
  navigateWithLoader,
  setUserName,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
const isFocused = useIsFocused();
const [key, setKey] = useState(0); // used to force re-mount
// Initialize modular instances
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);
useEffect(() => {
  if (isFocused) {
    // Force re-mount Animated.View so entering animations run again
    setKey((prev) => prev + 1);
  }
}, [isFocused]);

  const offsetY = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      offsetY.value = withTiming(-(e.endCoordinates.height / 2), {
        duration: 300,
      });
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      offsetY.value = withTiming(0, { duration: 300 });
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password.");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Fetch user profile from Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    let name = "User";
    if (docSnap.exists()) {
      name = docSnap.data()?.name || "Suniol";
    }

    // 3️⃣ Update global username (drawer or state)
    setUserName(name);

    setLoading(false);

    // 4️⃣ Navigate to Home screen
    navigateWithLoader(() => navigation.navigate("Home"));
  } catch (error) {
    setLoading(false);
    console.error("Login Failed:", error);
    Alert.alert("Login Failed", error.message || "Something went wrong");
  }
};

  return (
    <LinearGradient colors={["#800000", "#ff6f6fff"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View key={key} style={[styles.keyboardView, animatedStyle]}>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.title}
          >
            Welcome
          </Animated.Text>

          <Animated.View
            entering={FadeInUp.delay(400).duration(800)}
            style={styles.inputBox}
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor="#eee"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(600).duration(800)}
            style={styles.inputBox}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="#eee"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginButton}
              onPress={handleLogin}
            >
              {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginButton}
              onPress={() =>
                {setUserName("Sunil");
                navigateWithLoader(() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home", params: { userName: "Sunil" } }], // Navigate to drawer
                  })
                )
              }}
            > */}
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
          {/* <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <GoogleSignInButton
                onSuccess={(user) => {
                  console.log("Logged in with Google:", user.displayName);
                  // Navigate to Main screen or do whatever you need
                }}
              />
            </TouchableOpacity>
          </Animated.View> */}
          <Animated.Text
            entering={FadeInUp.delay(1000).duration(800)}
            style={styles.registerText}
          >
            Don’t have an account?{" "}
            <Text
              style={styles.signUp}
              onPress={() =>
                navigateWithLoader(() => navigation.navigate("Registration"))
              }
            >
              Sign Up
            </Text>
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* ✅ Loader overlay */}
      <Loader visible={loading} />
    </LinearGradient>
  );
}
