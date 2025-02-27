/*Monthly.js*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Monthly.css";

function Monthly() {
  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Firebase 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 로그아웃 기능
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/"); // 홈으로 이동
      })
      .catch((error) => console.log("로그아웃 실패:", error));
  };

  // 날짜 클릭 시 Daily 페이지로 이동
  const handleDateClick = (date) => {
    navigate(`/daily/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
  };

  // 달 이동 함수
  const goToPreviousMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  return (
    <main className="monthly-container">
      {/* 로그인한 사용자 정보 표시 */}
      {user && (
        <header className="user-header">
          <span>{user.displayName}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </header>
      )}

      <aside className="prev-container">
        <button className="prev-month" onClick={goToPreviousMonth}>
          &lt; 
        </button>
      </aside>

      <section className="calendar-container">
        <header className="calendar-header">
        <h2>{date.getMonth() + 1}</h2>           
        <h3>{date.toLocaleString("en-US", { year: "numeric" })}</h3>
        <h3>{date.toLocaleString("en-US", { month: "long" })}</h3>
        </header>

        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={handleDateClick}
          showFixedNumberOfWeeks={true}
          tileContent={({ date }) => (
            <article className="calendar-day">
              <div className="day-circle">
                <span className="day-number">{date.getDate()}</span>
              </div>
              <figure className="icon-box"></figure>
            </article>
          )}
        />
      </section>

      <bside className="next-container">
        <button className="next-month" onClick={goToNextMonth}>
          &gt;
        </button>
      </bside>
    </main>
  );
}


export default Monthly;
