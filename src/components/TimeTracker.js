import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/TimeTracker.css";

const TimeTracker = ({ date }) => {
  const hours = Array.from({ length: 22 }, (_, i) => 5 + i); // 5AM ~ 2AM
  const minutes = [0, 30]; // 30분 단위

  const [selectedHour, setSelectedHour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // 카테고리 데이터
  const [todos, setTodos] = useState([]); // To-Do 데이터
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
  const [selectedTodo, setSelectedTodo] = useState(""); // 선택된 To-Do
  const [startHour, setStartHour] = useState(""); // 시작 시간
  const [startMinute, setStartMinute] = useState(""); // 시작 분
  const [endHour, setEndHour] = useState(""); // 종료 시간
  const [endMinute, setEndMinute] = useState(""); // 종료 분
  const [color, setColor] = useState(""); // 색상 (카테고리 색상)
  const [timeBlocks, setTimeBlocks] = useState([]); // 선택한 시간 블록

  // Firebase에서 카테고리 가져오기
  const fetchCategories = async () => {
    const q = query(collection(db, "categories"), where("date", "==", date));
    try {
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Firebase에서 To-Do 가져오기
  const fetchTodos = async () => {
    const q = query(collection(db, "todos"), where("date", "==", date));
    try {
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // 시간 클릭 시 모달 열기
  const openModal = (hour) => {
    const displayHour = hour > 24 ? hour - 24 : hour; // 익일 1AM부터 1, 2로 표시
    setSelectedHour(displayHour);
    setIsModalOpen(true);

    fetchCategories(); // 카테고리 가져오기
    fetchTodos(); // To-Do 가져오기
    setSelectedCategory(""); // 카테고리 초기화
    setSelectedTodo(""); // To-Do 초기화
    setStartHour(""); // 시작 시간 초기화
    setStartMinute(""); // 시작 분 초기화
    setEndHour(""); // 종료 시간 초기화
    setEndMinute(""); // 종료 분 초기화
    setColor(""); // 색상 초기화
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHour(null);
  };

  // 시작 시간과 종료 시간이 올바르게 선택됐는지 확인
  const handleSave = () => {
    if (
      !startHour || !startMinute ||
      !endHour || !endMinute ||
      (parseInt(startHour) > parseInt(endHour)) ||
      (parseInt(startHour) === parseInt(endHour) && parseInt(startMinute) >= parseInt(endMinute))
    ) {
      alert("시작 시간과 종료 시간을 올바르게 선택해주세요.");
      return;
    }

    // 선택한 시간만큼 색칠 및 저장 로직 추가 (시간 블록에 할 일이 표시되고 색상 설정)
    const startTimeInMinutes = (parseInt(startHour) * 60) + parseInt(startMinute);
    const endTimeInMinutes = (parseInt(endHour) * 60) + parseInt(endMinute);

    // 시간 블록 계산 (시작 시간부터 종료 시간까지)
    let newBlocks = [];
    for (let time = startTimeInMinutes; time < endTimeInMinutes; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      newBlocks.push({ hour, minute, todo: selectedTodo, color: color });
    }

    // 시간 블록 추가
    setTimeBlocks(prevState => [...prevState, ...newBlocks]);

    alert(`시간이 저장되었습니다: ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`);
    closeModal();
  };

  return (
    <div className="time-tracker">
      {hours.map((hour) => {
        const displayHour = hour > 24 ? hour - 24 : hour;
        return (
          <div key={hour} className="hour-block" onClick={() => openModal(hour)}>
            <span>{displayHour}</span>
            <div className="half-hour-line"></div>
            
            {/* 시간 블록에 할 일 표시 */}
            {timeBlocks.map((block, index) => {
              if (block.hour === displayHour) {
                return (
                  <div key={index} className="todo-block" style={{ backgroundColor: block.color }}>
                    <span>{block.todo}</span>
                  </div>
                );
              }
            })}
          </div>
        );
      })}

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedHour}:00 할 일 선택</h2>

            {/* 카테고리 선택 (드롭다운) */}
            <h3>📂 카테고리 선택</h3>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedTodo(""); // 카테고리 바꾸면 To-Do 선택 초기화
              }}
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* To-Do 선택 (드롭다운) */}
            <h3>📌 To-Do 선택</h3>
            <select
              value={selectedTodo}
              onChange={(e) => setSelectedTodo(e.target.value)}
              disabled={!selectedCategory} // 카테고리 선택 전에는 비활성화
            >
              <option value="">To-Do 선택</option>
              {todos
                .filter(todo => todo.categoryId === selectedCategory)
                .map(todo => (
                  <option key={todo.id} value={todo.id}>
                    {todo.text}
                  </option>
                ))}
            </select>

            {/* 시작 시간 설정 */}
            <h3>⏰ 시작 시간 설정</h3>
            <div className="time-picker">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
              >
                <option value="">시작 시간</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour < 10 ? `0${hour}` : hour}
                  </option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
              >
                <option value="">시작 분</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute < 10 ? `0${minute}` : minute} 분
                  </option>
                ))}
              </select>
            </div>

            {/* 종료 시간 설정 */}
            <h3>⏳ 종료 시간 설정</h3>
            <div className="time-picker">
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
              >
                <option value="">종료 시간</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour < 10 ? `0${hour}` : hour}
                  </option>
                ))}
              </select>
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
              >
                <option value="">종료 분</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute < 10 ? `0${minute}` : minute} 분
                  </option>
                ))}
              </select>
            </div>

            {/* 확인 버튼 */}
            <button onClick={handleSave}>확인</button>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
