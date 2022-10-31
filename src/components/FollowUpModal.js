import { useState } from "react";
import Modal from "react-modal";
import { writeNewCall } from "../utils/firebase.utils";

Modal.setAppElement("#__next");

function FollowUpModal({
  isFollowUpModalOpen,
  setFollowUpModal,
  followUpChamado,
  setFollowUpChamado,
}) {
  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "24px",
      height: "80%",
      width: "65%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };
  
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setFollowUpChamado({ ...followUpChamado, [name]: value });
  }
  
  function handleCloseModal() {
    setFollowUpModal(false);
  }


  function handleSaveFollowUp() {
    writeNewCall(followUpChamado);
    setFollowUpModal(false);
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
            name="followUp"
            placeholder="Escreva aqui o acompanhamento"
            className="p-4 w-[100%]text-base"
            value={followUpChamado.followUp}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSaveFollowUp} className="btnSaveDetails">
          Salvar
        </button>
      </div>
    </Modal>
  );
}

export default FollowUpModal;
