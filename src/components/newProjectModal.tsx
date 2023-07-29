import { useState, useEffect } from "react";

import Modal from "react-modal";
import { User } from "../models/User";
import projectApi from "../api/projectApi";
import { useSelector } from "react-redux";
import { selectUser } from "../store/userSlicer/user.selector";

Modal.setAppElement("#__next");

interface NewProjectModalProps {
  isModalOpen: boolean;
  setModal: (is: boolean) => void;
}

export default function NewProjectModal({ isModalOpen, setModal} : NewProjectModalProps) {
  const [projName, setProjName] = useState("");
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [error, setError] = useState("");
  // const { name: username } = useSelector(selectUser) ?? { name: "" };

  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "24px",
    },
  };

  function handleCloseModal() {
    setModal(false);
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projName) {
      setIsRegisterFull(false);
      return;
    }
    
    await projectApi.createNewProject(projName)
    handleCloseModal();
    setProjName("");
  }

  useEffect(() => {
    setIsRegisterFull(true);
    setError("");
  }, [isModalOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      <form
        onSubmit={handleRegister}
        className="w-[100%] h-[100%] mx-auto flex flex-col"
      >
        <h1 className="text-black text-2xl font-semibold mx-auto mt-10 mb-8 pb-1 border-b border-gray-400">
          Cadastrar novo projeto;
        </h1>
        <input
          onChange={(e) => {
            setProjName(e.target.value);
          }}
          name="name"
          value={projName}
          placeholder="Nome do Projeto ou Empresa"
          className="inputCadastro"
          type="text"
        />
        <button className=" bg-blue-600 btnCadastrar">Cadastrar</button>
      </form>
      {isRegisterFull ? (
        ""
      ) : (
        <p className="text-red-600">Preencha Todos os Campos</p>
      )}
      {error ? <p className="text-red-600">{error}</p> : ""}
    </Modal>
  );
}
