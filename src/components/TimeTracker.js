/* TimeTracker.js */
/*import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig"; // Firebase 연결
import { collection, getDocs } from "firebase/firestore"; // Firestore에서 데이터 가져오기

const TimeTracker = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeBlocks, setTimeBlocks] = useState([]);

  useEffect(() => {
    // Firestore에서 할 일 데이터 가져오기 (이미 가져온 tasks가 있으면 그걸 사용)
    if (!tasks || tasks.length === 0) return;

    // 시간 블록 초기화 (예: 24시간을 30분 단위로 나눈 블록)
    const blocks = Array.from({ length: 48 }, (_, index) => ({
      time: `${Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`,
      task: null,
      duration: 0,
    }));
    setTimeBlocks(blocks);
  }, [tasks]);

  const handleTimeBlockClick = (index) => {
    // 시간을 클릭하면 할 일을 선택하도록 하는 처리
    const selectedTask = prompt("할 일을 입력하세요: (기존 할 일을 입력해 주세요.)", "");
    const duration = parseInt(prompt("소요 시간을 분 단위로 입력하세요 (30분 단위)", "30"), 10);

    if (!selectedTask || !duration) return;

    const updatedTimeBlocks = [...timeBlocks];
    // 시간에 맞춰 색칠 및 할 일 설정
    const startIndex = index;
    const endIndex = index + duration / 30;

    for (let i = startIndex; i < endIndex; i++) {
      updatedTimeBlocks[i] = { ...updatedTimeBlocks[i], task: selectedTask, duration };
    }

    setTimeBlocks(updatedTimeBlocks);
  };

  // 원형 타임 트래커의 스타일을 설정
  const generateTimeBlockStyles = (index) => {
    const block = timeBlocks[index];
    return block.task
      ? { backgroundColor: "lightblue", height: `${(block.duration / 30) * 100}%` }
      : {};
  };

  return (
    <div className="time-tracker-container">
      <div className="time-tracker">
        {timeBlocks.map((block, index) => (
          <div
            key={index}
            className="time-block"
            style={generateTimeBlockStyles(index)}
            onClick={() => handleTimeBlockClick(index)}
          >
            {block.time}
            {block.task && <div>{block.task}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTracker;
*/