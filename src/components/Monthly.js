import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "../styles/Monthly.css";
import UserModal from "../components/UserModal";

const Monthly = () => {
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState({}); // 날짜별 할 일 상태
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 로그인된 사용자 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Firebase에서 특정 날짜의 할 일 데이터 가져옴.
  const fetchTodoStatsForDate = async (selectedDate) => {
    const q = query(collection(db, "todos"), where("date", "==", selectedDate));

    try {
      const querySnapshot = await getDocs(q);
      let totalTodos = 0;
      let completedTodos = 0;

      querySnapshot.forEach((doc) => {
        totalTodos += 1;
        if (doc.data().completed) {
          completedTodos += 1;
        }
      });

      return { totalTodos, completedTodos };
    } catch (error) {
      console.error("할 일 데이터를 가져오는 중 오류 발생:", error);
      return { totalTodos: 0, completedTodos: 0 };
    }
  };

  // 현재 월의 모든 날짜에 대해 할 일 상태를 가져와 콘솔 출력
  useEffect(() => {
    const fetchAllTodoStatus = async () => {
      let statusMap = {};

      for (let i = 1; i <= 31; i++) {
        const dateStr = `2025-03-${i.toString().padStart(2, "0")}`; // YYYY-MM-DD 형식

        const { totalTodos, completedTodos } = await fetchTodoStatsForDate(dateStr);

        if (totalTodos === 0) {
          statusMap[dateStr] = ""; // 할 일이 없는 경우
        } else if (completedTodos === 0) {
          statusMap[dateStr] = "fork"; // 완료된 할 일이 없는 경우
        } else if (completedTodos > 0 && completedTodos < totalTodos) {
          statusMap[dateStr] = "strawberry"; // 일부 완료
        } else if (completedTodos === totalTodos) {
          statusMap[dateStr] = "cake"; // 모든 할 일 완료
        }

        // 콘솔에 현재 날짜별 상태 출력
        console.log(`[${dateStr}] 할 일: ${totalTodos}, 완료: ${completedTodos}, 상태: ${statusMap[dateStr]}`);
      }

      setTodos(statusMap);
    };

    fetchAllTodoStatus();
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
    <div className="monthly-container">
      {/* 로그인한 사용자 정보 */}
      {user && (
        <header className="user-header">
          <span className="user-name">{user.displayName}</span>
          {/* 프로필 이미지 버튼 */}
          <img
            src={"/assets/poc_profile.png"}
            alt="User Profile"
            className="user-profile-img"
            onClick={() => setIsModalOpen(true)}
          />
        </header>
      )}
      {/* 유저 모달 */}
      {isModalOpen && <UserModal user={user} onClose={() => setIsModalOpen(false)} />}

      {/* 상단 헤더 */}
      <header className="calendar-header">
        <div className="Num-m">
          <img src="/assets/poc_monthly_star.png" alt="Num-m-pic" className="Num-m-img" />
          <span className="Num-m-text">{date.getMonth() + 1}</span>
        </div>
        <span className="En-y-m">
          {date.getFullYear()} {date.toLocaleString("en-US", { month: "long" })}
        </span>
      </header>

      {/* 캘린더와 네비게이션 버튼을 감싼 컨테이너 */}
      <div className="calendar-wrapper">
        <button className="prev-month-button" onClick={prevMonth}>〈</button>
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
              classNames += todos[tileDateString].completed ? " todo-completed" : " todo-pending";
            }

            return classNames.trim();
          }}
          tileContent={({ date: tileDate, view }) => {
            const tileDateString = format(new Date(tileDate).setHours(0, 0, 0, 0), "yyyy-MM-dd");
            return (
              <div className="date-content">
                <span className="date-label">{tileDate.getDate()}</span>
                <div className={`icon-box ${todos[tileDateString] ? "has-todo" : "no-todo"}`}>
                  {todos[tileDateString] ? (
                    todos[tileDateString] === "fork" ? (
                      <figure className="icon">
                        <img src="/assets/poc_icon_fork.png" alt="fork"/>
                      </figure>
                    ) : todos[tileDateString] === "strawberry" ? (
                      <figure className="icon">
                        <img src="/assets/poc_icon_strawberry.png" alt="fork"/>
                        </figure>
                    ) : (
                      <figure className="icon">
                        <img src="/assets/poc_icon_cake.png" alt="fork"/>
                        </figure>
                    )
                  ) : (
                    <figure className="icon-placeholder"></figure>
                  )}
                </div>
              </div>
            );
          }}
        />
        <button className="next-month-button" onClick={nextMonth}>〉</button>
      </div>
    </div>
  );
};

export default Monthly;
