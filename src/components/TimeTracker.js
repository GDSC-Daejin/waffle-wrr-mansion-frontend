import React from "react";
import "../styles/TimeTracker.css"; // 스타일 파일 추가

const TimeTracker = () => {
  const hours = Array.from({ length: 22 }, (_, i) => 5 + i); // 5AM ~ 2AM

  return (
    <div className="time-tracker">
      {hours.map((hour) => {
        // 익일 1시(25)부터는 1, 2로 다시 표시
        const displayHour = hour > 24 ? hour - 24 : hour;

        return (
          <div key={hour} className="hour-block" onClick={() => console.log(`${displayHour}:00 클릭됨!`)}>
            <span>{displayHour}:00</span>
            <div className="half-hour-line"></div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeTracker;
