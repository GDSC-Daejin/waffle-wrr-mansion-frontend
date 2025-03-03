/*firebaseConfig.js */
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
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
//Firebase 초기화
const app = initializeApp(firebaseConfig);
//Firebase 서비스 초기화
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db}
