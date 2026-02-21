// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzJpzmjY0Zo8aGUcyx-DYbAwhQe7hjxcA",
    authDomain: "nerophet.firebaseapp.com",
    projectId: "nerophet",
    storageBucket: "nerophet.firebasestorage.app",
    messagingSenderId: "402611255119",
    appId: "1:402611255119:web:e28b555993173dc021b73a",
    measurementId: "G-3Z8MWDPWDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (export để dùng ở các file khác)
export const analytics = getAnalytics(app);
export const db = getFirestore(app);       // Firestore Database
export const auth = getAuth(app);          // Authentication

export default app;
