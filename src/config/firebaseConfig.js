// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiT_t07K5sFChhVLqQzBeL2RXpm-1I5c4",
  authDomain: "waffle-wrr-mansion.firebaseapp.com",
  databaseURL: "https://waffle-wrr-mansion-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "waffle-wrr-mansion",
  storageBucket: "waffle-wrr-mansion.firebasestorage.app",
  messagingSenderId: "140803942934",
  appId: "1:140803942934:web:c4c44799f30031a45ca337",
  measurementId: "G-S6CLC1LMR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);