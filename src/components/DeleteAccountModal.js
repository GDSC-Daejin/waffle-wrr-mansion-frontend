import React from "react";
import { deleteUser } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        localStorage.clear();
        navigate("/"); // 홈으로 이동
      })
      .catch((error) => console.error("회원 탈퇴 실패:", error));
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
            {/* 회원 탈퇴 버튼 클릭 시 바로 회원 탈퇴 진행 */}
            <button
              className="logout-btn"
              onClick={handleDeleteAccount}
              aria-label="Delete Account"
            >
              회원 탈퇴
            </button>

        </section>
      </article>
    </div>
  );
};

export default DeleteAccountModal;
