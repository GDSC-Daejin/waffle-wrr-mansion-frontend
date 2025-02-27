// Sign.js
import { auth } from "../config/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 로그인 성공 후 navigate 추가
export function handleGoogleLogin(setUserData, navigate) {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((data) => {
      setUserData(data.user);
      console.log(data);
      navigate('/monthly'); // 로그인 후 Monthly 페이지로 이동
    })
    .catch((err) => {
      console.log(err);
    });
}

