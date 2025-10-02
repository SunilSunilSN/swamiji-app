// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBlVHD18ID7Eitr3LmfixvSPK9zHwUaTHU",
  authDomain: "swamiji-app-b03d7.firebaseapp.com",
  projectId: "swamiji-app-b03d7",
  storageBucket: "swamiji-app-b03d7.firebasestorage.app",
  messagingSenderId: "351979190801",
  appId: "1:351979190801:web:f1c4e9034f92a9b92e8fb0",
  measurementId: "G-H160KVCGR8"
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage for auth persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);