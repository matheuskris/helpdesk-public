import { useEffect, useState } from "react";
import { writeNewCall } from "../utils/firebase.utils";

import Modal from "react-modal";
Modal.setAppElement("#__next");

export const initialCall = {
  id: "",
  client: "",
  userClient: "",
  start: "",
  title: "",
  description: "",
  priority: "",
  inCharge: "",
};

export default function CreateCallModal({
  userUid,
  projectUid,
  isModalOpen,
  setModal,
  personsInProject,
}) {
  const [infoCall, setInfoCall] = useState(initialCall);
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [error, setError] = useState("");

  // ====== Funções do Modal =========
  function handleCloseModal() {
    setModal(false);
  }

  useEffect(() => {
    setIsRegisterFull(true);
    setError("");
  }, [isModalOpen]);
  // Estilo do Modal
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

  // adding new call to firebase thru the modal
  async function handleRegister(e) {
    e.preventDefault();
    const newDate = new Date();
    const sendDate = Date.parse(newDate);
    const objectToSend = {
      ...infoCall,
      start: sendDate,
    };

    for (const prop in objectToSend) {
      if (!objectToSend[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }

    const string = await writeNewCall(projectUid, userUid, objectToSend);
    if (string === "success") {
      console.log("chamado criado com sucesso");
    } else {
      setError(string);
      console.log(string);
      return;
    }
    setInfoCall({
      id: "",
      client: "",
      userClient: "",
      start: "",
      title: "",
      description: "",
      priority: "",
      inCharge: "",
    });
    setModal(false);
    setIsRegisterFull(false);
  }

  // Normal handle change
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setInfoCall({ ...infoCall, [name]: value });
  }

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
          Detalhes do Chamado
        </h1>
        <input
          onChange={handleChange}
          name="id"
          value={infoCall.id}
          placeholder="ID"
          className="inputCadastro"
          type="number"
        />
        <input
          onChange={handleChange}
          name="client"
          value={infoCall.client}
          placeholder="Cliente"
          className="inputCadastro"
          type="text"
        />
        <input
          onChange={handleChange}
          name="userClient"
          value={infoCall?.userClient}
          placeholder="Usuário Cliente"
          className="inputCadastro"
          type="text"
        />
        <input
          onChange={handleChange}
          name="title"
          value={infoCall.title}
          placeholder="Título"
          className="inputCadastro"
          type="text"
        />
        <input
          onChange={handleChange}
          name="description"
          value={infoCall.description}
          placeholder="Descrição"
          className="inputCadastro"
          type="text"
        />
        <select
          onChange={handleChange}
          name="priority"
          value={infoCall.priority}
          className="p-4 outline-none inputCadastro"
        >
          <option defaultValue={true}>Prioridade:</option>
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
        <select
          onChange={handleChange}
          name="inCharge"
          value={infoCall.inCharge}
          className="p-4 outline-none inputCadastro"
        >
          <option defaultValue={true}>Responsável:</option>
          {personsInProject.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
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
