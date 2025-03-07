import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "../styles/Memo.css"; // CSS 파일 가져오기

const Memo = ({ date }) => {
  const [note, setNote] = useState(""); // 메모 상태
  const [userId, setUserId] = useState(null); // 사용자 ID

  // 사용자 인증 확인 후 userId 설정
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchMemo(user.uid);
      }
    });
    return () => unsubscribe();
  }, [date]);

  // Firestore에서 메모 가져오기
  const fetchMemo = async (uid) => {
    if (!uid) return;
    const docRef = doc(db, "users", uid, "todos", date);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().memo) {
      setNote(docSnap.data().memo.text);
    }
  };

  // Firestore에 메모 저장
  const saveMemo = async () => {
    if (!userId || note.trim() === "") return;

    const docRef = doc(db, "users", userId, "todos", date);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 기존 메모가 있으면 업데이트
      await updateDoc(docRef, { memo: { text: note, timestamp: new Date() } });
    } else {
      // 새로운 메모 생성
      await setDoc(docRef, { memo: { text: note, timestamp: new Date() } });
    }
  };

  // 엔터 키 입력 감지 후 저장
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
