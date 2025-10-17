// firebaseConfig.js
import { firebase } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Firebase config object from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBSGMx9AMXfrMkfvfgrV58h9kab_lTWYHM",
  authDomain: "sriramanujavani-32f08.firebaseapp.com",
  projectId: "sriramanujavani-32f08",
  storageBucket: "sriramanujavani-32f08.firebasestorage.app",
  messagingSenderId: "450308056905",
  appId: "1:450308056905:android:943bfe5e3ed7868d329c98",
  measurementId: "G-N5C4MPJNVV",
};

// Export auth & firestore instances
export { auth, firestore, firebaseConfig };
