import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // Firebase 설정 파일
import { Users } from "../components/Users"; // 유저 생성 함수

export const handleGoogleLogin = async (setUserData, navigate) => {
  const provider = new GoogleAuthProvider();

    // 계정 선택 창 강제
    provider.setCustomParameters({
      prompt: "select_account"
    });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Firestore에 사용자 프로필이 없으면 생성 (가입 날짜 추가됨)
    await Users(user);

    // 로그인한 사용자 데이터 상태 업데이트
    setUserData({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
    });

    // Monthly 페이지로 이동
    navigate("/monthly"); // 필요한 경로로 변경
  } catch (error) {
    console.error("로그인 오류:", error.message);
  }
};
