import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function DescriptionModal({ isDescriptionModalOpen, setDescriptionModal, description }) {

  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "24px",
      height: "200px",
      width: "600px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };

  function handleCloseModal() {
    setDescriptionModal(false);
  }

  return (
    <Modal
      isOpen={isDescriptionModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      <div className="flex items-center text-left flex-col space-y-2">
        <h1 className="font-bold text-lg">Descrição Completa</h1>
        <p className="text-base">{description}</p>
      </div>
    </Modal>
  );
}

export default DescriptionModal;
