import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function FollowUpModal({ isFollowUpModalOpen, setFollowUpModal, followUpText, setFollowUpText }) {
  const [followUp, setFollowUp] = useState(followUpText);
  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "24px",
      height: "60%",
      width: "50%",
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

  function handleSaveFollowUp() {

  }

  return (
    <Modal
      isOpen={isFollowUpModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      <div className="flex items-center text-left flex-col w-[100%] space-y-2">
        <h1 className="font-bold -tracking-tighter text-lg">Acompanhamento</h1>
        <div className="w-[100%]">
          <textarea
            rows={"16"}
            cols={"120"}
            placeholder="Escreva aqui o acompanhamento"
            className="p-4 w-[100%]text-base"
          >
            {followUp}
          </textarea>
        </div>
        <button
          onClick={handleSaveFollowUp}
          className="btnSaveDetails"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}

export default FollowUpModal;
