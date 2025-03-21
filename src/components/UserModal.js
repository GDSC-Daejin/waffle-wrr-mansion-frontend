// UserModal.js
import React from "react";
import MypageModal from "./MypageModal";
import DeleteAccountModal from "./DeleteAccountModal";
import useModal from "../hooks/useModal";

const UserModal = ({ user, onClose }) => {
  const { isDeleteModal, openDeleteModal, closeDeleteModal } = useModal();

  return (
    <>
      {isDeleteModal ? (
        <DeleteAccountModal user={user} onClose={closeDeleteModal} />
      ) : (
        <MypageModal user={user} onClose={onClose} onDeleteClick={openDeleteModal} />
      )}
    </>
  );
};

export default UserModal;

