import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDv7TsWzVud1v38TDabksZnv5QJu29l0aA",
    authDomain: "lsoys-assignment.firebaseapp.com",
    projectId: "lsoys-assignment",
    storageBucket: "lsoys-assignment.appspot.com",
    messagingSenderId: "286580961932",
    appId: "1:286580961932:web:7ff3677f8814f56932c1a9",
    measurementId: "G-RXPMYXZZ41"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);