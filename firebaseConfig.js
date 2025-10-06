// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBSGMx9AMXfrMkfvfgrV58h9kab_lTWYHM",
  authDomain: "sriramanujavani-32f08.firebaseapp.com",
  projectId: "sriramanujavani-32f08",
  storageBucket: "sriramanujavani-32f08.firebasestorage.app",
  messagingSenderId: "450308056905",
  appId: "1:450308056905:web:810caade70e413fc329c98",
  measurementId: "G-N5C4MPJNVV"
};

const app = initializeApp(firebaseConfig);

// Use AsyncStorage for auth persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);