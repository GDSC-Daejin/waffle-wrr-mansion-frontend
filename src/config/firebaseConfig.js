// Firebase SDK에서 필요한 기능 가져오기
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // 인증 추가
import { getFirestore } from "firebase/firestore";  // Firestore 추가
import { getAnalytics } from "firebase/analytics";

// Firebase 설정
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

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // 인증 인스턴스 생성
const db = getFirestore(app);  // Firestore 인스턴스 생성
const analytics = getAnalytics(app);  // Analytics 초기화 (선택)

// `auth`와 `db`를 export
export { auth, db };
export default app;
