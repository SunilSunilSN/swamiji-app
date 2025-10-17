import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import styles from "../styles/RegistrationStyle";
import Loader from "../components/Loader";
import { useIsFocused } from "@react-navigation/native";


// ✅ RNF v22+ Modular imports
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";


export default function RegistrationScreen({ navigation, navigateWithLoader }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const [key, setKey] = useState(0);

  const offsetY = useSharedValue(0);

  const app = getApp(); // Modular: get default app
  const auth = getAuth(app); // Modular auth instance
  const db = getFirestore(app); // Modular Firestore instance

  useEffect(() => {
    if (isFocused) setKey(prev => prev + 1);

    const showSub = Keyboard.addListener("keyboardWillShow", e => {
      offsetY.value = withTiming(-(e.endCoordinates.height / 2), { duration: 300 });
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      offsetY.value = withTiming(0, { duration: 300 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

const handleRegister = async () => {
  if (!name || !mobile || !email || !password) {
    Alert.alert("Error", "Please fill all fields.");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      mobile,
      email,
      createdAt: serverTimestamp(), // ✅ modular timestamp
    });

    setLoading(false);
    Alert.alert("Success", "Account created successfully!");
    navigateWithLoader(() => navigation.navigate("Login"));
  } catch (error) {
    setLoading(false);
    console.error("Registration Failed:", error);
    Alert.alert("Registration Failed", error.message || "Something went wrong");
  }
};

  return (
    <LinearGradient colors={["#800000", "#ff6f6fff"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View key={key} style={[styles.keyboardView, animatedStyle]}>
          <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.title}>
            Create Account
          </Animated.Text>

          {/* Name */}
          <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.inputBox}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#eee"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </Animated.View>

          {/* Mobile */}
          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.inputBox}>
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#eee"
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </Animated.View>

          {/* Email */}
          <Animated.View entering={FadeInUp.delay(500).duration(800)} style={styles.inputBox}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#eee"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Animated.View>

          {/* Password */}
          <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.inputBox}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#eee"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          {/* Register Button */}
          <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <TouchableOpacity activeOpacity={0.8} style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back to Login */}
          <Animated.Text entering={FadeInUp.delay(1000).duration(800)} style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.signUp} onPress={() => navigateWithLoader(() => navigation.navigate("Login"))}>
              Login
            </Text>
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Loader */}
      <Loader visible={loading} />
    </LinearGradient>
  );
}
