import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function MessageModal({ visible, message, type = "error", onClose }) {
  const bgColor = type === "error" ? "#800000" : type === "success" ? "#4CAF50" : "#ff6f6fff";
  const textColor = type === "info" ? "#000" : "#fff"; // ensure contrast for readability

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { borderColor: bgColor }]}>
          <Text style={[styles.modalText, { color: textColor }]}>{message}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={onClose}>
            <Text style={[styles.buttonText, { color: textColor }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    minWidth: "70%",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  button: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});
