import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import styles from "../styles/RegistrationStyle";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig"; // db for Firestore
import { doc, setDoc } from "firebase/firestore";
import Loader from "../components/Loader";

export default function RegistrationScreen({ navigation, navigateWithLoader }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !mobile || !email || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        mobile,
        email,
        createdAt: new Date(),
      });

      setLoading(false);
      Alert.alert("Success", "Account created successfully!");
      navigateWithLoader(() => navigation.navigate("Login"));
    } catch (error) {
      setLoading(false);
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <LinearGradient colors={[ "#800000", "#ff6f6fff"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={styles.keyboardView}>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.title}
          >
            Create Account
          </Animated.Text>

          {/* Name Input */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(800)}
            style={styles.inputBox}
          >
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#eee"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </Animated.View>

          {/* Mobile Input */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(800)}
            style={styles.inputBox}
          >
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#eee"
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </Animated.View>

          {/* Email Input */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(800)}
            style={styles.inputBox}
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor="#eee"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </Animated.View>

          {/* Password Input */}
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

          {/* Register Button */}
          <Animated.View entering={FadeInUp.delay(800).duration(800)}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back to Login */}
          <Animated.Text
            entering={FadeInUp.delay(1000).duration(800)}
            style={styles.loginText}
          >
            Already have an account?{" "}
            <Text
              style={styles.signUp}
              onPress={() =>
                navigateWithLoader(() => navigation.navigate("Login"))
              }
            >
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
