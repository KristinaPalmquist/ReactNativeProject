import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_ynpSKChst-6aOO8zUZvbt8fwpJDDs1k",
  authDomain: "iths-crossplatform-8045a.firebaseapp.com",
  projectId: "iths-crossplatform-8045a",
  storageBucket: "iths-crossplatform-8045a.appspot.com",
  messagingSenderId: "251023492438",
  appId: "1:251023492438:web:e9ae48cf8474d9e50282f7",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
