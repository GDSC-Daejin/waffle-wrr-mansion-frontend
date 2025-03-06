import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import "../styles/Memo.css";

const Memo = () => {
  const [note, setNote] = useState("");

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDate = getTodayDate();
  const memoRef = doc(db, "Users", "daily", todayDate); // 특정 유저 ID 없이 저장

  // Firestore에서 오늘의 메모 불러오기
  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const docSnap = await getDoc(memoRef);
        if (docSnap.exists()) {
          setNote(docSnap.data().text); // 기존 메모 로드
        }
      } catch (error) {
        console.error("메모 불러오기 실패:", error);
      }
    };

    fetchMemo();
  }, []);

  // Firestore에 메모 저장
  const saveMemo = async () => {
    if (note.trim() === "") return; // 빈 값 방지

    try {
      const docSnap = await getDoc(memoRef);

      if (docSnap.exists()) {
        // 기존 메모가 있으면 업데이트 (이어쓰기)
        await updateDoc(memoRef, {
          text: docSnap.data().text + "\n" + note,
          updatedAt: Timestamp.now(),
        });
      } else {
        // 새 문서 생성
        await setDoc(memoRef, {
          text: note,
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("메모 저장 실패:", error);
    }
  };

  // 엔터 키 입력 감지
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveMemo();
    }
  };

  return (
    <div className="memo-container">
      <div className="memo-header"></div>
      <div className="memo-body">
        <textarea
          className="memo-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메모를 입력하세요..."
        />
      </div>
    </div>
  );
};

export default Memo;


