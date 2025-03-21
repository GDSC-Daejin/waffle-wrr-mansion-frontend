import { useState } from "react";

const useModal = () => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const openDeleteModal = () => setIsDeleteModal(true);
  const closeDeleteModal = () => setIsDeleteModal(false);

  return {
    isDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  };
};

export default useModal;
