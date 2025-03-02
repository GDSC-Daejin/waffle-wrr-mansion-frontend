import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import MypageModal from "./MypageModal";
import DeleteAccountModal from "./DeleteAccountModal";

const UserModal = ({ user, onClose }) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false); // delete 모달 여부

  // 회원 탈퇴 버튼을 클릭하면 delete 모달로 전환
  const handleDeleteClick = () => {
    setIsDeleteModal(true);
  };

  return (
    <>
      {isDeleteModal ? (
        <DeleteAccountModal user={user} onClose={() => setIsDeleteModal(false)} />
      ) : (
        <MypageModal user={user} onClose={onClose} onDeleteClick={handleDeleteClick} />
      )}
    </>
  );
};

export default UserModal;
