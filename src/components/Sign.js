import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // Firebase 설정 파일

export const handleGoogleLogin = async (setUserData, navigate) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userId = user.uid;

    // Firestore에 사용자 프로필 생성 (users/{userId})
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      joinedAt: new Date(),
    });

    // 로그인한 사용자 데이터 상태 업데이트
    setUserData({
      uid: userId,
      name: user.displayName,
      email: user.email,
    });

    // Monthly 페이지로 이동
    navigate("/monthly"); // 필요한 경로로 변경
  } catch (error) {
    console.error("로그인 오류:", error.message);
  }
};
