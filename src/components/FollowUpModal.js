import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");


function FollowUpModal( { isFollowUpModalOpen, setFollowUpModal } ) {
  const customStyle = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "24px",
        height: "450px",
        width: "700px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
    };

    function handleOpenModal() {
      setFollowUpModal(true);
    }

    function handleCloseModal() {
      setFollowUpModal(false);
    }

  return (
    <Modal
      isOpen={isFollowUpModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      <div className="flex items-center text-left flex-col space-y-2">
        <h1 className="font-bold -tracking-tighter text-lg">Acompanhamento</h1>
        <p className="text-base">{'uau'}</p>
      </div>
    </Modal>
  )
}

export default FollowUpModal;