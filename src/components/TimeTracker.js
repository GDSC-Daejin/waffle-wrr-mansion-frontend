/*TimeTracker.js */
import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, setDoc, doc,deleteDoc } from "firebase/firestore";
import "../styles/TimeTracker.css";
import CustomAlert from "./CustomAlert";

const TimeTracker = ({ date }) => {
  const hours = Array.from({ length: 21 }, (_, i) => 5 + i); // 5AM ~ 2AM
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
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지
  const [isAlertOpen, setIsAlertOpen] = useState(false); // 알림 상태


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

  // Firebase에서 시간 블록 가져오기
const fetchTimeBlocks = async () => {
  const q = query(collection(db, "timeBlocks"), where("date", "==", date));
  try {
    const querySnapshot = await getDocs(q);
    const timeBlocksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 유효한 타임블럭만 필터링
    const validTimeBlocks = [];

    // 각 타임블럭을 순회하면서, 해당 타임블럭의 할일을 Firebase의 To-Do 목록과 비교
    for (let block of timeBlocksData) {
      const matchingTodo = todos.find(todo => todo.text === block.todo); // 타임블럭에 저장된 할일과 To-Do 목록의 할일 비교
      if (matchingTodo) {
        // 일치하는 할일이 있으면 유효한 타임블럭에 추가
        validTimeBlocks.push(block);
      } else {
        // 일치하지 않는 할일이 있으면 타임블럭 삭제
        await deleteDoc(doc(db, "timeBlocks", block.id));
        console.log(`타임블럭(${block.id}) 삭제됨`);
      }
    }

    // 유효한 타임블럭만 상태에 저장
    setTimeBlocks(validTimeBlocks);

  } catch (error) {
    console.error("Error fetching time blocks:", error);
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

  // 시간 블록을 Firebase에 저장하기
  const saveTimeBlocksToFirebase = async (newBlocks) => {
    try {
      const timeBlocksRef = collection(db, "timeBlocks");
      for (let block of newBlocks) {
        const blockRef = doc(timeBlocksRef);
        await setDoc(blockRef, {
          hour: block.hour,
          minute: block.minute,
          todo: block.todo,
          color: block.color,
          date: date // 날짜도 저장하여 해당 날짜에만 표시
        });
      }
      console.log("시간 블록이 저장되었습니다.");
    } catch (error) {
      console.error("시간 블록 저장 오류:", error);
    }
  };

  // 시작 시간과 종료 시간이 올바르게 선택됐는지 확인하고 저장
  const handleSave = () => {
    if (
      !startHour || !startMinute ||
      !endHour || !endMinute ||
      (parseInt(startHour) > parseInt(endHour)) ||
      (parseInt(startHour) === parseInt(endHour) && parseInt(startMinute) >= parseInt(endMinute))
    ) {
      setAlertMessage("선택한 시간에는 할 일을 추가할 수 없어요. \n\n선택한 시간을 확인해주세요!");
      setIsAlertOpen(true); // 알림 창 열기
      return;
    }

 // ✅ 선택된 To-Do의 text 값을 가져오기
  const selectedTodoObj = todos.find(todo => todo.id === selectedTodo);
  const selectedTodoText = selectedTodoObj ? selectedTodoObj.text : "할 일 없음"; // 기본값 설정

  const startTimeInMinutes = (parseInt(startHour) * 60) + parseInt(startMinute);
  const endTimeInMinutes = (parseInt(endHour) * 60) + parseInt(endMinute);

  let newBlocks = [];
  for (let time = startTimeInMinutes; time < endTimeInMinutes; time += 30) {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    newBlocks.push({ hour, minute, todo: selectedTodoText, color: color }); // ✅ text 값 저장
  }

  saveTimeBlocksToFirebase(newBlocks);
  setTimeBlocks(prevState => [...prevState, ...newBlocks]);

  setAlertMessage(`시간이 저장되었습니다: ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`);
  setIsAlertOpen(true); // 알림 창 열기  
  closeModal();
};

const closeAlert = () => {
  setIsAlertOpen(false);
};

 // 시간 블록 초기화 함수
  const resetTimeBlocks = async () => {
    try {
      // Firebase에서 해당 날짜의 모든 시간 블록 삭제
      const q = query(collection(db, "timeBlocks"), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref); // 각 문서 삭제
      });

      setTimeBlocks([]); // 클라이언트 상태 초기화
      alert("시간 블록이 초기화되었습니다.");
    } catch (error) {
      console.error("시간 블록 초기화 오류:", error);
    }
  };


  // 컴포넌트가 처음 렌더링될 때, 또는 날짜가 변경될 때 데이터 가져오기
useEffect(() => {
  const fetchData = async () => {
    await fetchCategories();  // 카테고리 가져오기
    await fetchTodos();       // To-Do 가져오기
  };

  fetchData();
}, [date]);  // 날짜가 변경될 때마다 다시 실행

// todos가 업데이트된 후에 timeBlocks를 가져오는 useEffect 추가
useEffect(() => {
  if (todos.length > 0) { // todos가 로드된 후에 timeBlocks 가져오기
    fetchTimeBlocks();
  }
}, [todos]); // todos가 업데이트될 때마다 실행

  return (
    <div className="time-tracker">
      {hours.map((hour) => {
        const displayHour = hour > 24 ? hour - 24 : hour;
        return (
          <div key={hour} className="hour-block" onClick={() => openModal(hour)}>
            <span>{displayHour}</span>
            
            {/* 30분 단위로 나누는 선 (가로로) */}
            <div className="half-hour-line"></div>
            
            {/* 시간 블록에 할 일 표시 */}
            {timeBlocks.map((block, index) => {
              if (block.hour === displayHour) {
                return (
                  <div
                    key={index}
                    className="todo-block"
                    style={{
                      backgroundColor: block.color,
                      left: block.minute === 0 ? 0 : '50%', // 30분 단위로 왼쪽(0분)과 오른쪽(30분) 배치
                      zIndex: index + 1, // 겹치는 할 일이 있을 경우 순차적으로 배치
                    }}
                  >
                    {block.todo}
                  </div>
                );
              }
            })}
          </div>
        );
      })}

      {/* 모달 */}
      {isModalOpen && (
        <div className="timemodal-overlay">
          <div className="timemodal">
            {/* 카테고리 선택 (드롭다운) */}
             <div className="selection-row">
            <h3>카테고리</h3>
            <select
              className="select-category"
              value={selectedCategory}
              onChange={(e) => {
                const selectedCatId = e.target.value;
                setSelectedCategory(selectedCatId);
                setSelectedTodo(""); // 카테고리 변경 시 To-Do 초기화

                // 🔥 선택한 카테고리의 색상을 가져와서 저장
                const selectedCat = categories.find(cat => cat.id === selectedCatId);
                if (selectedCat) {
                  setColor(selectedCat.color || "#ccc"); // 색상이 없으면 기본 회색
                }
              }}
            ><option value=""></option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            </div>

            {/* To-Do 선택 (드롭다운) */}
            <div className="selection-row">
            <h3>할 일</h3>
            <select
            className="select-todo"
              value={selectedTodo}
              onChange={(e) => setSelectedTodo(e.target.value)}
              disabled={!selectedCategory} // 카테고리 선택 전에는 비활성화
            >
              <option value=""></option>
              {todos
                .filter(todo => todo.categoryId === selectedCategory)
                .map(todo => (
                  <option key={todo.id}s value={todo.id}>
                    {todo.text}
                  </option>
                ))}
            </select>
            </div>
            <div
            style={{marginBottom:"5px"}}>
            <div className="time-picker-box">
            <div className="time-picker">
            <h3 className="time">시간</h3>
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                style={{
                  webkitAppearance:"none"
                }}
              >
                <option value="">24</option>
                {hours.map((hour) => {
  const displayHour = hour > 24 ? hour - 24 : hour;
  return (
    <option key={hour} value={hour}>
      {displayHour < 10 ? `0${displayHour}` : displayHour}
    </option>
  );
})}
              </select>
              :
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                style={{webkitAppearance:"none"}}
              >
                <option value="">00</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute < 10 ? `0${minute}` : minute}
                  </option>
                ))}
              </select>
             ~ 
              <select
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                style={{webkitAppearance: "none"}}
              >
                <option value="">24</option>
                {hours.map((hour) => {
  const displayHour = hour > 24 ? hour - 24 : hour;
  return (
    <option key={hour} value={hour}>
      {displayHour < 10 ? `0${displayHour}` : displayHour}
    </option>
  );
})}
              </select>
              :
              <select
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                style={{webkitAppearance: "none"}}
              >
                <option value="">00</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute < 10 ? `0${minute}` : minute}
                  </option>
                ))}
              </select>
            </div>
          </div>
          </div>
            {/* 확인 버튼 */}
            <div className="save-btn-box">
            <button 
            onClick={handleSave}
            className="modal-save-btn"
            >완료</button>
            </div>
          </div>
        </div>
      )}
      <CustomAlert
      message={alertMessage}
      isOpen={isAlertOpen}
      closeAlert={closeAlert}
    />
    </div>
  );
};

export default TimeTracker;
