import React, { useState, useEffect } from "react"; 
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { auth} from "../config/firebaseConfig"; // Firebase 인증 가져오기
import { signOut } from "firebase/auth";
import "react-calendar/dist/Calendar.css";
import "../styles/Monthly.css"; // CSS 파일 사용

const Monthly = () => {
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState({}); // 할 일 목록을 객체로 관리 (날짜별로 할 일)
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const navigate = useNavigate();

  // 로그인된 사용자 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleDateClick = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    navigate(`/daily/${formattedDate}`);
  };

  const prevMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 로그아웃 처리
  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/"); // 로그아웃 후 홈으로 이동
    }).catch((error) => console.error("로그아웃 실패:", error));
  };

  // 테스트용: 할 일 데이터를 추가
  useEffect(() => {
    setTodos({
      "2025-03-01": { completed: true },
      "2025-03-05": { completed: false },
      "2025-03-10": { completed: true },
    });
  }, []);

  return (
    <div className="monthly-container">
      {/* 로그인한 사용자 정보 표시 */}
      {user && (
        <header className="user-header">
          <span className="user-name">{user.displayName}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </header>
      )}

      {/* 상단 헤더 */}
      <header className="calendar-header">
        <div className="Num-m">
          <img src="/assets/poc_monthly_star.png" alt="Num-m-pic" className="Num-m-img"/>
          <span className="Num-m-text">{date.getMonth() + 1}</span>
        </div>
        <span className="En-y-m">{date.getFullYear()} {date.toLocaleString("en-US", { month: "long" })}</span>
      </header>

      {/* 캘린더와 네비게이션 버튼을 감싼 컨테이너 */}
      <div className="calendar-wrapper">
        <button className="prev-month-button" onClick={prevMonth}>〈</button>
        <Calendar
          onClickDay={handleDateClick}
          value={date}
          locale="en"
          showNavigation={false}
          showFixedNumberOfWeeks={true} // 6줄 고정
          calendarType="hebrew"
          next2Label={null}
          prev2Label={null}
          tileClassName={({ date: tileDate, view }) => {
            const currentMonth = date.getMonth(); // 현재 선택된 달
            const tileMonth = tileDate.getMonth(); // 각 날짜의 달
            const day = tileDate.getDay(); // 요일 구하기
            const tileDateString = tileDate.toISOString().split("T")[0]; // 날짜 문자열

            let classNames = "";

            // 요일별 색상 추가
            if (day === 0) classNames += " sunday";
            else if (day === 6) classNames += " saturday";
            else classNames += " weekday";

            // 현재 달이 아니면 불투명하게
            if (tileMonth !== currentMonth) {
              classNames += " neighboring-month";
            }

            // 할 일 아이콘 박스 추가
            if (todos[tileDateString]) {
              classNames += todos[tileDateString].completed
                ? " todo-completed"
                : " todo-pending";
            }

            return classNames.trim();
          }}
          tileContent={({ date: tileDate, view }) => {
            const tileDateString = tileDate.toISOString().split("T")[0]; // 날짜 문자열
            if (todos[tileDateString]) {
              return (
                <div className="icon-box">
                  {todos[tileDateString].completed ? (
                    <span className="icon-completed">✔️</span>
                  ) : (
                    <span className="icon-pending">❌</span>
                  )}
                </div>
              );
            }
          }}
        />
        <button className="next-month-button" onClick={nextMonth}>〉</button>
      </div>
    </div>
  );
};

export default Monthly;
