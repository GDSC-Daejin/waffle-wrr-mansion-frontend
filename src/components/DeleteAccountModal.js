import React from "react";
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      console.error("❌ 현재 로그인된 사용자가 없음!");
      return;
    }

    try {
      const user = auth.currentUser;
      console.log("✅ 회원 탈퇴 버튼 클릭됨! 현재 사용자:", user);

      // 🔹 1. Google 계정 재인증 (필수)
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
      console.log("✅ Google 계정 재인증 완료!");

      // 🔹 2. Firestore에서 유저 데이터 삭제
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);
      console.log("✅ Firestore에서 유저 삭제 완료!");

      // 🔹 3. Firebase Authentication에서 유저 삭제
      await deleteUser(user);
      console.log("✅ Firebase Authentication에서 유저 삭제 완료!");

      // 🔹 4. 로컬 저장소 데이터 삭제
      localStorage.clear();

      // 🔹 5. 홈으로 이동
      navigate("/");
    } catch (error) {
      console.error("❌ 회원 탈퇴 실패:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <article className="user-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">회원 탈퇴</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">X</button>
        </header>

        <section className="modal-content">
          <article className="delete-message">
            <div className="image-container">
              <img src="/assets/poc_user_delete.png" alt="User Delete" />
              <span>에서</span>
            </div>
            <span>
              <br />
              {user?.displayName || "사용자"}님의 목표를 이루었어요!<br />
              지금까지 쌓아온 달콤한 기록들이 모두 사라집니다.<br />
              그래도 정말 떠나시겠어요?
            </span>
          </article>
          <button className="logout-btn" onClick={handleDeleteAccount} aria-label="Delete Account">
            회원 탈퇴
          </button>
        </section>
      </article>
    </div>
  );
};

export default DeleteAccountModal;






