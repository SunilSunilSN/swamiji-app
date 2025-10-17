import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../../firebaseConfig";
import * as AuthSession from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// ✅ Required: completes any pending auth session
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton({ onSuccess }) {
  // ✅ useProxy must be FALSE for standalone builds (true only for Expo Go)
  //   const redirectUri = AuthSession.makeRedirectUri({
  //   scheme: "sriramanujavani", // 👈 same as app.json
  // });
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "450308056905-agm09n2d3ofm35oi2semkkhn7ms3mjbb.apps.googleusercontent.com",
    iosClientId: "351979190801-qtm9rl7df5okpcr00odbvq1ue1sug8m5.apps.googleusercontent.com",
    // webClientId: "450308056905-mrjjb4afqkgbpre58rj3rgp1gh7q5epf.apps.googleusercontent.com",
        redirectUri: AuthSession.makeRedirectUri({
    native: "com.sunilsn.sriramanujavani:/oauthredirect",
  }),
    useProxy: false, // ❗ important: false for APK builds
  });

  React.useEffect(() => {
    console.log("Google Auth Response:", response);

    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("Firebase user:", userCredential.user);
          onSuccess && onSuccess(userCredential.user);
        })
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
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}
