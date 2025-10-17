// PaymentScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import Loader from "../components/Loader";
import MessageModal from "../components/MessageModal";
// Firebase
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

export default function PaymentScreen({ route, navigation, navigateWithLoader }) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const { subscriptionAmount = 100, userId } = route.params || {};
  const [transactionId] = useState(`T${Date.now()}`);

  const upiId = "sunilsnsuni28-6@okhdfcbank";
  const note = `Subscription for user ${userId || "GUEST"}`;

  /// Message Modal//
const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [modalType, setModalType] = useState("info");
const [modalClose, setModalClose] = useState(() => () => setModalVisible(false));
  // Copy UPI ID
  const handleCopyUPI = async () => {
    await Clipboard.setStringAsync(upiId);
    showModal("UPI ID copied to clipboard.", "success");
  };

  // --- Helper to show modal ---
const showModal = (msg, type = "error", onCloseAction = null) => {
  setModalMessage(msg);
  setModalType(type);
  setModalVisible(true);
  setModalClose(() => {
    return onCloseAction
      ? () => {
          setModalVisible(false);
          onCloseAction();
        }
      : () => setModalVisible(false);
  });
};
  // Download QR image to gallery
  const handleDownloadQR = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        showModal("Permission Denied", "error");
        return;
      }

      const qrAsset = require("../assets/Images/QR_PAYMENT.jpg");
      const qrUri = Image.resolveAssetSource(qrAsset).uri;

      const filename = `bhakthi_qr_${Date.now()}.jpg`;
      const destUri = FileSystem.documentDirectory + filename;

      const result = await FileSystem.downloadAsync(qrUri, destUri);

      const asset = await MediaLibrary.createAssetAsync(result.uri);
      await MediaLibrary.createAlbumAsync("Bhakthi Nivedana", asset, false);

      showModal("Saved!", "QR code saved to your gallery 📸", "success");
    } catch (err) {
      showModal(`Unable to save QR: ${err.message}`, "error");
    }
  };

  // Pick payment screenshot
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showModal("We need access to your gallery to upload the screenshot.", "info");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri =
        result.assets && result.assets.length > 0
          ? result.assets[0].uri
          : result.uri;
      setImageUri(uri);
    }
  };

  // Submit payment proof
const handleSubmitProof = async () => {
  if (!userId || !imageUri) {
    showModal("User ID or screenshot missing.", "error");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Convert image to Base64
    const base64Data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2️⃣ Create a storage reference
    const fileName = `${transactionId}_${Date.now()}.jpg`;
    const storageRef = storage().ref(`payment_proofs/${userId}/${fileName}`);

    // 3️⃣ Upload Base64 string and wait for completion
    const task = storageRef.putString(base64Data, "base64", {
      contentType: "image/jpeg",
    });

    // ✅ Wait until upload completes
    await task;

    // 4️⃣ Get download URL
    const downloadUrl = await storageRef.getDownloadURL();

    // 5️⃣ Update Firestore user document
    await firestore()
      .collection("bhakthiSubscribers")
      .doc(userId)
      .set(
        {
          paymentStatus: "proof_submitted",
          paymentProofUrl: downloadUrl,
          proofSubmittedAt: firestore.FieldValue.serverTimestamp(),
          transactionId,
          amountPaid: subscriptionAmount,
          status: "mobile_verified_payment_proof_submmitted"
        },
        { merge: true }
      );

    setLoading(false);
showModal(
  "Your payment proof has been uploaded successfully! Our team will verify your payment and activate your subscription soon.",
  "success",
  () => navigateWithLoader(() => navigation.navigate("Home"))
);
  } catch (err) {
    console.error("Payment Upload Error:", err);
    setLoading(false);
    showModal("Upload Failed", err.message || "Something went wrong.", "error");
  }
};

  return (
    <LinearGradient colors={["#800000", "#ff6f6fff"]} style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(800)}
            style={styles.title}
          >
            Premium Payment
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(400).duration(800)}
            style={styles.amountText}
          >
            Amount: ₹{subscriptionAmount}
            {/* {"\n"}(Transaction ID: {transactionId}) */}
          </Animated.Text>

          {/* QR Section */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(800)}
            style={styles.qrSection}
          >
            <Text style={styles.sectionTitle}>Scan this QR Code to Pay</Text>
            <Image
              source={require("../assets/Images/QR_PAYMENT.jpg")}
              style={styles.qrImage}
            />

            {/* <TouchableOpacity style={styles.copyButton} onPress={handleCopyUPI}>
              <Text style={styles.copyText}>📋 Copy UPI ID ({upiId})</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadQR}
            >
              <Text style={styles.downloadText}>📥 Download QR Image</Text>
            </TouchableOpacity>

            {/* <Text style={styles.noteText}>Add payment note: "{note}"</Text> */}
          </Animated.View>

          {/* Upload Proof Section */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(800)}
            style={styles.uploadSection}
          >
            <Text style={styles.sectionTitle}>Upload Payment Screenshot</Text>

            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  onPress={pickImage}
                  style={[styles.uploadButton, { backgroundColor: "#777" }]}
                >
                  <Text style={styles.uploadText}>Change Screenshot</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Text style={styles.uploadText}>Select Payment Screenshot</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitButton, { opacity: imageUri ? 1 : 0.5 }]}
              onPress={handleSubmitProof}
              disabled={!imageUri || loading}
            >
              <Text style={styles.submitText}>
                {loading ? "Submitting..." : "Submit Proof & Activate"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
      <Loader visible={loading} />
       <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={modalClose} />
    </LinearGradient>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, width: "100%" },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  amountText: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 28,
  },
  qrSection: { alignItems: "center", marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  noteText: { color: "#ccc", fontSize: 14, textAlign: "center", marginTop: 5 },
  copyButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  copyText: { color: "#4b0000", fontWeight: "600" },
  downloadButton: {
    marginTop: 10,
    backgroundColor: "#800000",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  downloadText: { color: "#fff", fontWeight: "600" },
  uploadSection: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
  },
  uploadButton: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#800000",
    marginBottom: 20,
  },
  uploadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  imagePreview: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ffff",
  },
  submitButton: {
    width: "80%",
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  submitText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#4b0000",
    textAlign: "center",
  },
});
