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

export default function EditTramiteModal({
  isEditModalOpen,
  setEditModal,
  editChamado,
  editTramite,
  setTramiteToEdit,
}) {
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [timeInput, setTimeInput] = useState({});
  const chamadoToEdit = editChamado;
  // ====== Funções do Modal =========
  function handleCloseModal() {
    setEditModal(false);
  }

  useEffect(() => {
    const newDateObject = new Date(editTramite.start);

    const minutes =
      newDateObject.getMinutes() < 10
        ? "0" + newDateObject.getMinutes()
        : newDateObject.getMinutes();

    const hours =
      newDateObject.getHours() < 10
        ? "0" + newDateObject.getHours()
        : newDateObject.getHours();
    const day =
      newDateObject.getDate() < 10
        ? "0" + newDateObject.getDate()
        : newDateObject.getDate();

    const date =
      newDateObject.getFullYear() +
      "-" +
      (newDateObject.getMonth() + 1) +
      "-" +
      day;

    const hour = hours + ":" + minutes;
    setTimeInput({ date, hour });
  }, [isEditModalOpen]);

  useEffect(() => {
    const myDateString = timeInput.date + "T" + timeInput.hour;
    const myNewDate = new Date(myDateString);
    const dateInMs = Date.parse(myNewDate);
    setTramiteToEdit({ ...editTramite, start: dateInMs });
  }, [timeInput]);

  function handleTimeChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setTimeInput({ ...timeInput, [name]: value });
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

    for (const prop in editTramite) {
      if (!editTramite[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }

    const objectToSend = {
      ...chamadoToEdit,
      tramites: {
        ...chamadoToEdit?.tramites,
        [editTramite.id]: {
          ...editTramite,
        },
      },
    };

    console.log(objectToSend);
    await editExistingCall(objectToSend, chamadoToEdit.id);
    setIsRegisterFull(true);
    setEditModal(false);
  }

  // Normal handle change
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setTramiteToEdit({ ...editTramite, [name]: value });
  }

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      <form
        onSubmit={handleRegister}
        className="w-[100%] h-[100%] mx-auto flex flex-col"
      >
        <h1 className="text-black text-2xl font-semibold mx-auto mt-10 mb-8 pb-1 border-b border-gray-400">
          Editando Trâmite
        </h1>
        <input
          name="id"
          value={editTramite.id}
          placeholder="ID"
          className="inputCadastro"
          type="text"
          disabled
        />
        <input
          onChange={handleChange}
          name="title"
          value={editTramite.title}
          placeholder="Título"
          className="inputCadastro"
          type="text"
        />
        <input
          name="hour"
          type="time"
          className="inputCadastro"
          onChange={handleTimeChange}
          value={timeInput.hour}
        />
        <input
          name="date"
          type="date"
          className="inputCadastro"
          onChange={handleTimeChange}
          value={timeInput.date}
        />
        <textarea
          onChange={handleChange}
          name="description"
          value={editTramite.description}
          placeholder="Descrição"
          className="inputCadastro"
          type="text"
        />
        <select
          onChange={handleChange}
          name="inCharge"
          value={editTramite.inCharge}
          className="p-4 outline-none inputCadastro"
        >
          <option value="Flávio">Flávio</option>
          <option value="Patrícia">Patrícia</option>
          <option value="Mônica">Mônica</option>
        </select>
        <button className=" bg-blue-600 btnCadastrar">Salvar alterações</button>
      </form>
      {isRegisterFull ? (
        ""
      ) : (
        <p className="text-red-600">Preencha Todos os Campos</p>
      )}
    </Modal>
  );
}
