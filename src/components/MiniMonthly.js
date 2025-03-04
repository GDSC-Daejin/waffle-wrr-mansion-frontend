/*MiniMonthly.js*/
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "../styles/MiniMonthly.css"; // 기존 Monthly.css 불러오기

const MiniMonthly = () => {
  const [date, setDate] = useState(new Date());
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
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    navigate(`/daily/${formattedDate}`); // 날짜를 URL로 전달
  };

  const prevMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="mini-monthly-container"> {/* 고유한 클래스 추가 */}
      {/* 상단 헤더 */}
      <header className="mini-calendar-header">
        <button className="prev-month-button" onClick={prevMonth}>〈</button>
        <span className="mini-En-y-m" >
          {date.getFullYear()} {date.toLocaleString("en-US", { month: "long" })}
        </span>
        <button className="next-month-button" onClick={nextMonth}>〉</button>
      </header>

      {/* 캘린더와 네비게이션 버튼을 감싼 컨테이너 */}
      <div className="mini-calendar-wrapper" >
        <Calendar
          onClickDay={handleDateClick}
          value={date}
          locale="en"
          showNavigation={false}
          showFixedNumberOfWeeks={true}
          calendarType="hebrew"
          next2Label={null}
          prev2Label={null}
          tileClassName={({ date: tileDate, view }) => {
            const currentMonth = date.getMonth(); // 현재 선택된 달
            const tileMonth = tileDate.getMonth(); // 각 날짜의 달
            const day = tileDate.getDay(); // 요일 구하기

            let classNames = "";

            // 요일별 색상 추가
            if (day === 0) classNames += " sunday";
            else if (day === 6) classNames += " saturday";
            else classNames += " weekday";

            // 현재 달이 아니면 불투명하게
            if (tileMonth !== currentMonth) {
              classNames += " neighboring-month";
            }

            return classNames.trim();
          }}
          tileContent={({ date: tileDate, view }) => {
            return (
              <div className="mini-date-content">
                <span className="mini-date-label">{tileDate.getDate()}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MiniMonthly;
