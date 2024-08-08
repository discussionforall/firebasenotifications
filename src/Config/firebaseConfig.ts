import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGsbqPsNaW3SOqrjrtZc9r9n825gOj-N4",
  authDomain: "fir-notifications-2024.firebaseapp.com",
  projectId: "fir-notifications-2024",
  storageBucket: "fir-notifications-2024.appspot.com",
  messagingSenderId: "663302507937",
  appId: "1:663302507937:web:b7ded7c62755d33f77cfe0",
  measurementId: "G-8XJWJRTKTT"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
