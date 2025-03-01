import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Firebase db 가져오기
import "../styles/Daily.css";
import Todo from "./Todo";  // Todo 컴포넌트 임포트

function Daily() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [photo, setPhoto] = useState("");
  const [memo, setMemo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 날짜를 파싱
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date"); // 'date=YYYY-MM-DD' 형태로 전달됨

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 해당 날짜의 Todo를 Firebase에서 가져오는 함수
  const fetchTodosForDate = async (date) => {
    try {
      const todosRef = collection(db, "users", user.uid, "todos");
      const q = query(todosRef, where("date", "==", date));  // 해당 날짜에 맞는 Todo만 가져옴
      const querySnapshot = await getDocs(q);

      const todosList = [];
      querySnapshot.forEach((doc) => {
        todosList.push(doc.data());
      });
      setTodos(todosList);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Todo, 메모, 사진이 없다면 Firebase에 기본 값 추가
  const createDefaultData = async (date) => {
    try {
      const todosRef = doc(db, "users", user.uid, "todos", date);
      
      const data = {
        todo: [], // 기본값: 빈 Todo 리스트
        photo: { url: "", timestamp: new Date() }, // 빈 사진 URL (추후 업로드로 변경 가능)
        memo: { text: "", timestamp: new Date() } // 빈 메모
      };
      
      await setDoc(todosRef, data);
      fetchTodosForDate(date);  // 데이터를 생성한 후 다시 불러오기
    } catch (error) {
      console.error("Error creating default data:", error);
    }
  };

  useEffect(() => {
    if (user && dateParam) {
      fetchTodosForDate(dateParam); // 날짜가 있을 경우 해당 날짜의 Todo 불러오기
    }
  }, [user, dateParam]);

  // Firebase에 데이터가 없으면 기본 데이터를 생성
  useEffect(() => {
    if (user && dateParam && todos.length === 0) {
      createDefaultData(dateParam); // 데이터가 없으면 기본 데이터 생성
    }
  }, [todos, dateParam, user]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/"); // 홈으로 이동
      })
      .catch((error) => console.log("로그아웃 실패:", error));
  };

  const handleSaveMemo = async () => {
    if (memo) {
      try {
        const todosRef = doc(db, "users", user.uid, "todos", dateParam);
        await setDoc(
          todosRef,
          { memo: { text: memo, timestamp: new Date() } },
          { merge: true }
        );
        setMemo(""); // 메모 입력 후 초기화
      } catch (error) {
        console.error("Error saving memo:", error);
      }
    }
  };

  const handleSavePhoto = async () => {
    if (photo) {
      try {
        const todosRef = doc(db, "users", user.uid, "todos", dateParam);
        await setDoc(
          todosRef,
          { photo: { url: photo, timestamp: new Date() } },
          { merge: true }
        );
        setPhoto(""); // 사진 입력 후 초기화
      } catch (error) {
        console.error("Error saving photo:", error);
      }
    }
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
          {/* Todo 컴포넌트에 해당 날짜의 Todo 전달 */}
          <Todo todos={todos} date={dateParam} />
        </div>
        <div className="mini-monthly">3. 미니 먼슬리</div>
      </section>

      {/* 아랫줄 3칸 */}
      <section className="daily-bottom">
        <div className="memo">
          4. 메모장
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Enter your memo"
          />
          <button onClick={handleSaveMemo}>Save Memo</button>
        </div>
        <div className="photo-album">
          6. 사진첩
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0]?.name)} // 파일 선택 후 URL 저장 (임시로 이름만 저장)
          />
          <button onClick={handleSavePhoto}>Save Photo</button>
        </div>
      </section>
    </div>
  );
}

export default Daily;
