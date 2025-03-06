import React, { useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import "../styles/Memo.css"; // CSS 파일 가져오기

const Memo = () => {
  const [note, setNote] = useState("");

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식 반환
  };

  // Firestore에 메모 저장 함수
  const saveMemo = async () => {
    if (note.trim() === "") return; // 빈 값 방지

    const todayDate = getTodayDate(); // 오늘 날짜 가져오기
    const memoRef = doc(db, "memos", todayDate); // 해당 날짜 문서 참조

    try {
      const docSnap = await getDoc(memoRef);

      if (docSnap.exists()) {
        // 기존 메모가 있으면 업데이트 (이어쓰기)
        await updateDoc(memoRef, {
          text: docSnap.data().text + "\n" + note, // 기존 메모에 추가
          updatedAt: Timestamp.now(),
        });
      } else {
        // 해당 날짜 문서가 없으면 새로 생성
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
    if (e.key === "Enter" && !e.shiftKey) { // Shift + Enter가 아니면 저장
      e.preventDefault();
      saveMemo();
    }
  };

  return (
    <div className="memo-container">
      <div className="memo-header"></div> {/* "memo" 텍스트 부분 */}
      <div className="memo-body">
        <textarea
          className="memo-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 감지
          placeholder="메모를 입력하세요..."
        />
      </div>
    </div>
  );
};

export default Memo;