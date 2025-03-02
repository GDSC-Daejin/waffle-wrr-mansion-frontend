import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MypageModal.css";

const MypageModal = ({ user, onClose, onDeleteClick }) => {
  const [showDelete, setShowDelete] = useState(false); // 회원 탈퇴 상태 관리
  const navigate = useNavigate();

  // 로그아웃 기능
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // 회원 탈퇴 버튼 클릭 시 처리
  const handleDeleteAccount = () => {
    onDeleteClick(); // 회원 탈퇴 모달 띄우기
    setShowDelete(false); // 회원 탈퇴 버튼 숨기기
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <article className="user-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">my page</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">X</button>
        </header>

        <section className="modal-content">
          <aside className="aside">
            <img
              src={user?.photoURL || "/assets/default-profile.png"}
              alt="Profile"
              className="profile-img"
            />
          </aside>
          <main className="main">
            <h3 className="user-name">{user?.displayName || "사용자"}</h3>
            <p className="user-email">{user?.email || "이메일 없음"}</p>
          </main>
          <aside className="bside">
            {/* '...' 버튼 클릭 시 회원 탈퇴 버튼을 표시 */}
            <button
              className="options-btn"
              onClick={() => setShowDelete(!showDelete)}
              aria-label="Toggle delete options"
            >
              ...
            </button>

            <button
              className="logout-btn"
              onClick={showDelete ? handleDeleteAccount : handleLogout}
              aria-label={showDelete ? "Delete account" : "Logout"}
            >
              {showDelete ? "회원 탈퇴" : "로그아웃"}
            </button>
          </aside>
        </section>
      </article>
    </div>
  );
};

export default MypageModal;
