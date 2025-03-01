// UserHeader.js
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig"; // Firebase 인증
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/UserHeader.css"; // 추가적인 스타일 적용 가능

const UserHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 로그인된 사용자 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/"); // 로그아웃 후 홈으로 이동
      })
      .catch((error) => console.error("로그아웃 실패:", error));
  };

  return (
    <header className="user-header">
      {user && (
        <>
          <span className="user-name">{user.displayName}</span>
          <img src="/assets/poc_profile.png" alt="user-profile" className="user-profile" />
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </>
      )}
    </header>
  );
};

export default UserHeader;
