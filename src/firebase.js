import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import getFirestore from firebase/firestore

const firebaseConfig = {
  apiKey: "AIzaSyC7PEU36dMwbKutbiWjlAArV-sQKp7hyCo",
  authDomain: "invoice-manager-77368.firebaseapp.com",
  projectId: "invoice-manager-77368",
  storageBucket: "invoice-manager-77368.appspot.com",
  messagingSenderId: "221523706142",
  appId: "1:221523706142:web:0e348ba03d63929ce0890f",
  measurementId: "G-SM2JTBM1SE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app); // Use getFirestore instead of getFirestorestore
