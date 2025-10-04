import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export default function GoogleSignInButton({ onSuccess }) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // expoClientId: "351979190801-6jmjckhvrjmkmio5v932lnru44flbku6.apps.googleusercontent.com", // Web client ID
    iosClientId: "351979190801-qtm9rl7df5okpcr00odbvq1ue1sug8m5.apps.googleusercontent.com",
    androidClientId: "351979190801-12akn49pq2io70aso2h7v442k9pn6bnu.apps.googleusercontent.com",
    useProxy: false, // ✅ Required for Expo Go
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => onSuccess && onSuccess(userCredential.user))
        .catch((error) => Alert.alert("Login Failed", error.message));
    }
  }, [response]);

  return (
    <TouchableOpacity
      disabled={!request}
      onPress={() => promptAsync()}
      style={{
        padding: 15,
        backgroundColor: "#4285F4",
        borderRadius: 8,
        marginTop: 15,
      }}
    >
      <Text style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
