/* Daily.js */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "../styles/Daily.css";
import Todo from "./Todo";  // Todo 컴포넌트 임포트

function Daily() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/"); // 홈으로 이동
      })
      .catch((error) => console.log("로그아웃 실패:", error));
  };

  return (
    <div className="daily-container">
      {user && (
        <header className="user-header">
          <span>{user.displayName}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </header>
      )}
      {/* 윗줄 3칸 */}
      <section className="daily-top">
        <div className="time-tracker">1. 원형 타임 트래커</div>
        <div className="task-manager task-merged">
          {/* Todo 컴포넌트를 여기에 포함시킴 */}
          <Todo />
        </div>
        <div className="mini-monthly">3. 미니 먼슬리</div>
      </section>

      {/* 아랫줄 3칸 */}
      <section className="daily-bottom">
        <div className="memo">4. 메모장</div>
        <div className="photo-album">6. 사진첩</div>
      </section>
    </div>
  );
}

export default Daily;
