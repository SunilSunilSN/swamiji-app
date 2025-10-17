// BhakNivScreen.js
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  View,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Loader from "../components/Loader";
import { useIsFocused } from "@react-navigation/native";
import MessageModal from "../components/MessageModal";
// ✅ React Native Firebase
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Feature List
const featureList = [
  "Secrets And Stories From Our Ancient Scriptures",
  "Character Building Articles",
  "Scriptures & Philosophy By Great Scholars From India & USA",
  "FAQ Answered By HH Sri Chinna Jeeyar Swamiji",
  "Comics",
  "Enlightening Lessons From Bhagavad Githa & More",
];

// Feature Item
const FeatureItem = ({ text }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, paddingHorizontal: 5 }}>
    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#f0e68c", marginRight: 12 }} />
    <Text style={{ color: "#fff", fontSize: 16, flexShrink: 1, fontWeight: "300" }}>{text}</Text>
  </View>
);

// OTP Modal
const OTPVerificationModal = ({ visible, onClose, onVerify, loading }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length === 6) onVerify(otp);
    else Alert.alert("Invalid OTP", "Please enter the 6-digit code.");
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Verify Mobile Number</Text>
          <Text style={modalStyles.modalText}>Enter the 6-digit code sent to your mobile.</Text>

          <TextInput
            style={modalStyles.otpInput}
            placeholder="Enter OTP"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            editable={!loading}
          />

          <TouchableOpacity
            style={[modalStyles.button, modalStyles.buttonVerify]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={modalStyles.textStyle}>{loading ? "Verifying..." : "Verify OTP"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[modalStyles.button, modalStyles.buttonClose]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={modalStyles.textStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// MAIN SCREEN
export default function BhakNivScreen({ navigation, navigateWithLoader }) {
  /// Message Modal//
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");

  const showModal = (msg, type = "error") => {
    setModalMessage(msg);
    setModalType(type);
    setModalVisible(true);
  };
  // Message Modal//
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const isFocused = useIsFocused();
  const [key, setKey] = useState(0);

  // Keyboard animation
  const offsetY = useSharedValue(0);
  useEffect(() => {
    if (isFocused) {
      setKey((prev) => prev + 1);
      setName(""); setEmail(""); setMobile(""); setAddress("");
      const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
        offsetY.value = withTiming(-(e.endCoordinates.height * 0.35), { duration: 300 });
      });
      const hideSub = Keyboard.addListener("keyboardWillHide", () => {
        offsetY.value = withTiming(0, { duration: 300 });
      });
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  // Send OTP
  const handleSendOTP = async () => {
    if (!name || !mobile || !email || !address) {
      return showModal(`OTP sent to +91${mobile}`, "success");
    }

    setLoading(true);
    const phoneNumber = "+91" + mobile;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmationResult(confirmation);
      setShowOTPModal(true);
      showModal(`OTP sent to +91${mobile}`, "info");
    } catch (err) {
      console.error("OTP Error:", err);
      showModal(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
const handleVerify = async (otpCode) => {
   if (!confirmationResult) return Alert.alert("Error", "Request OTP again.");

   setLoading(true);
   try {
     // 1. Confirm the OTP and sign in/create the user
     const userCred = await confirmationResult.confirm(otpCode);
     const uid = userCred.user.uid; // Get the User ID

     // 2. Save user data to Firestore
     await firestore().collection("bhakthiSubscribers").doc(uid).set({
       // Use .doc(uid).set() instead of .add() to ensure the document ID is the user's UID
       uid: uid,
       name,
       email,
       address,
       mobile,
       verifiedAt: firestore.FieldValue.serverTimestamp(),
       status: "mobile_verified_awaiting_payment_proof", // Set initial status
     },{ merge: true });

     // 3. Navigate to Payment Screen, passing the user's UID
     setShowOTPModal(false);
     //showModal("Mobile verified. Redirecting to payment...", "success");
     
     // ⭐ Passing userId is crucial for linking the payment proof later
     navigateWithLoader(() => navigation.navigate("PaymentScreen", { 
       subscriptionAmount: 100,
       userId: uid, 
     }));
      // navigateWithLoader(() => navigation.navigate("PaymentScreen"))
     // NOTE: You typically DON'T sign out here if the user is immediately paying/using the app.
     // If you want them to remain signed in, remove the sign-out line.
     // If they should only proceed as a guest, then sign them out. 
     // For a typical app flow, they should stay signed in:
     // await auth().signOut(); 
     
   } catch (err) {
     console.error("Verification Error:", err);
     showModal(err.message || "Invalid OTP or network error");
   } finally {
     setLoading(false);
   }
 };

  return (
    <LinearGradient colors={["#800000", "#ff6f6fff"]} style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 50 }}>
            <Animated.View key={key} style={[styles.keyboardView, animatedStyle]}>
              <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={[styles.title, { fontSize: 32, marginBottom: 5 }]}>
                Bhakthi Nivedana
              </Animated.Text>
              <Animated.Text entering={FadeInDown.delay(300).duration(800)} style={{ ...styles.loginText, color: "#ffff", fontSize: 18, marginBottom: 30, fontWeight: "600" }}>
                Subscription
              </Animated.Text>

              <Text style={{ color: "#fff", fontSize: 16, marginBottom: 15, fontWeight: "500", width: "80%", alignSelf: "center" }}>
                Enter your details to Subscribe:
              </Text>

              {[{ placeholder: "Full Name", value: name, onChange: setName },
                { placeholder: "Email", value: email, onChange: setEmail },
                { placeholder: "Full Address", value: address, onChange: setAddress },
                { placeholder: "Mobile", value: mobile, onChange: setMobile, keyboardType: "phone-pad" },
              ].map(({ placeholder, value, onChange, keyboardType = "default" }, idx) => (
                <Animated.View key={idx} entering={FadeInUp.delay(500 + idx * 100).duration(600)} style={[styles.inputBox, { marginBottom: 15 }]}>
                  <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    autoCapitalize={placeholder.includes("Name") ? "words" : "none"}
                    autoCorrect={false}
                  />
                </Animated.View>
              ))}

              <Animated.View entering={FadeInUp.delay(900).duration(800)}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.registerButton, { marginTop: 5, backgroundColor: "#800000", borderRadius: 8, padding: 10,}]}
                  onPress={handleSendOTP}
                  disabled={loading && !showOTPModal}
                >
                  <Text style={[styles.registerText, { color: "#ffff", fontSize: 16, fontWeight: "700" }]}>
                    {loading && !showOTPModal ? "Sending..." : "Verify Mobile & Continue"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.Text entering={FadeIn.delay(1000).duration(800)} style={{ ...styles.loginText, textAlign: "left", color: "#ffc", marginTop: 30, marginBottom: 20, fontSize: 16, fontWeight: "500", width: "90%", alignSelf: "center" }}>
                Your subscription unlocks:
              </Animated.Text>

              <View style={{ width: "100%", alignSelf: "center" }}>
                {featureList.map((feature, i) => (
                  <Animated.View key={i} entering={FadeIn.delay(1100 + i * 100).duration(700)}>
                    <FeatureItem text={feature} />
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>

      <Loader visible={loading && !showOTPModal} />

      <OTPVerificationModal visible={showOTPModal} onClose={() => setShowOTPModal(false)} onVerify={handleVerify} loading={loading} />
        <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </LinearGradient>
  );
}

// Modal Styles
const modalStyles = {
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, width: "80%" },
  modalTitle: { marginBottom: 15, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#800000" },
  modalText: { marginBottom: 25, textAlign: "center", fontSize: 14, color: "#333" },
  otpInput: { height: 50, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20, textAlign: "center", fontSize: 18, letterSpacing: 10 },
  button: { borderRadius: 8, padding: 10, elevation: 2, marginTop: 10, width: "100%" },
  buttonVerify: { backgroundColor: "#800000" },
  buttonClose: { backgroundColor: "#888" },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center", fontSize: 16 },
};

import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
        justifyContent: "center",
    paddingHorizontal: responsiveWidth(6),
  },
  title: {
    fontSize: RFValue(26), // scales with screen size
    fontWeight: "700",
    color: "#fff",
    marginBottom: responsiveHeight(4),
    textAlign: "center",
  },
  inputBox: {
    width: "100%",
    marginBottom: responsiveHeight(2),
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    fontSize: RFValue(14),
    color: "#fff",
  },
  registerButton: {
    backgroundColor: "#fff",
    paddingVertical: responsiveHeight(1.8),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveHeight(2),
    alignItems: "center",
    width: responsiveWidth(60),
  },
  registerText: {
    color: "#800000",
    fontSize: RFValue(16),
    fontWeight: "600",
  },
  loginText: {
    marginTop: responsiveHeight(2),
    fontSize: RFValue(12),
    color: "#fff",
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: RFValue(12),
  },
  signUp: {
    color: "#fff",
    fontWeight: "700",
    fontSize: RFValue(12),
    
  },
});