/*Daily.js */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import UserModal from "../components/UserModal";
import TimeTracker from "../components/TimeTracker";
import MemoPad from "../components/Memo";
import Todo from "../components/Todo";
import MiniMonthly from "../components/MiniMonthly";
import PhotoGallery from "../components/Photo";
import "../styles/Daily.css";

const Daily = () => {
  const { date } = useParams(); // URL에서 날짜 받기
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 로그인된 사용자 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="daily-container">
      {/* 1. 헤더 */}
      {user && (
        <header className="user-header">
          <span className="user-name">{user.displayName}</span>
          <img
            src={"/assets/poc_profile.png"}
            alt="User Profile"
            className="user-profile-img"
            onClick={() => setIsModalOpen(true)}
          />
        </header>
      )}
      {isModalOpen && <UserModal user={user} onClose={() => setIsModalOpen(false)} />}

      <div className="daily-content">
        {/* 2. 좌측 Aside */}
        <aside className="daily-aside">
        <article className="time-tracker">
          <TimeTracker date={date} />
          </article>
        <article className="memo-pad">
          <MemoPad date={date} />
        </article>
        </aside>

        {/* 3. 중앙 Main */}
        <main className="daily-main">
          <Todo date={date} /> 
        </main>

        {/* 4. 우측 Bside */}
        <aside className="daily-bside">
          <article className="mini-monthly">
          <MiniMonthly date={date} />
          </article>
          <article className="photo-gallery">
          <PhotoGallery date={date} />
          </article>
        </aside>
      </div>
    </div>
  );
};

export default Daily;
