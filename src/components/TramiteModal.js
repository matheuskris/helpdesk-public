import { useEffect, useState } from "react";
import { editExistingCall } from "../utils/firebase.utils";

import Modal from "react-modal";

Modal.setAppElement("#__next");

export const initialCall = {
  id: "",
  title: "",
  description: "",
  inCharge: "",
};

export default function TramiteModal({
  isModalOpen,
  setModal,
  chamado,
  tramites,
}) {
  const [infoCall, setInfoCall] = useState(initialCall);
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const chamadoRecebido = chamado;
  // ====== Funções do Modal =========
  function handleCloseModal() {
    setModal(false);
  }

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

    for (const prop in infoCall) {
      if (!infoCall[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }

    const objectToSend = {
      ...chamadoRecebido,
      tramites: {
        ...chamadoRecebido?.tramites,
        [infoCall.id]: {
          ...infoCall,
          start: sendDate,
        },
      },
    };

    console.log(objectToSend);
    await editExistingCall(objectToSend, chamadoRecebido.id);
    setInfoCall({
      id: infoCall.id + 1,
      title: "",
      description: "",
      inCharge: "",
    });
    setIsRegisterFull(true);
    setModal(false);
  }

  // Normal handle change
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setInfoCall({ ...infoCall, [name]: value });
  }

  useEffect(() => {
    let nTramites = 0;
    if (tramites) {
      nTramites = tramites.length;
    }

    const newTramiteId = nTramites + 1;

    setInfoCall({ ...infoCall, id: newTramiteId });
  }, [chamadoRecebido]);

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
          Abrindo Trâmite
        </h1>
        <input
          name="id"
          value={infoCall.id}
          placeholder="ID"
          className="inputCadastro"
          type="text"
          disabled
        />
        <input
          onChange={handleChange}
          name="title"
          value={infoCall.title}
          placeholder="Título"
          className="inputCadastro"
          type="text"
        />
        <textarea
          onChange={handleChange}
          name="description"
          value={infoCall.description}
          placeholder="Descrição"
          className="inputCadastro"
          type="text"
        />
        <select
          onChange={handleChange}
          name="inCharge"
          value={infoCall.inCharge}
          className="p-4 outline-none inputCadastro"
        >
          <option defaultValue={true}>Responsável:</option>
          <option value="Flávio">Flávio</option>
          <option value="Patrícia">Patrícia</option>
          <option value="Mônica">Mônica</option>
        </select>
        <button className=" bg-blue-600 btnCadastrar">Criar</button>
      </form>
      {isRegisterFull ? (
        ""
      ) : (
        <p className="text-red-600">Preencha Todos os Campos</p>
      )}
    </Modal>
  );
}
