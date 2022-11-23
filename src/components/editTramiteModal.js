import { useEffect, useState } from "react";
import { editExistingTramite } from "../utils/firebase.utils";
import { getStringDateToTimeInput } from "../utils/functions.utils";

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
  const [error, setError] = useState("");
  const chamadoToEdit = editChamado;
  // ====== Funções do Modal =========
  function handleCloseModal() {
    setEditModal(false);
  }

  useEffect(() => {
    setIsRegisterFull(true);
  }, [isEditModalOpen]);

  useEffect(() => {
    const startObj = getStringDateToTimeInput(editTramite.start);
    const { hour, date } = startObj;
    let endTime = "";
    let endDate = "";
    if (editTramite.finished) {
      const endObj = getStringDateToTimeInput(editTramite.finished);
      endTime = endObj.hour;
      endDate = endObj.date;
    }

    setTimeInput({ date, hour, endTime, endDate });
  }, [isEditModalOpen]);

  useEffect(() => {
    const myStartDateString = timeInput.date + "T" + timeInput.hour;
    const myNewStartDate = new Date(myStartDateString);
    const startDateInMs = Date.parse(myNewStartDate);

    if (timeInput.endDate && timeInput.endTime) {
      const myEndDateString = timeInput.endDate + "T" + timeInput.endTime;
      const myNewEndDate = new Date(myEndDateString);
      const endDateInMs = Date.parse(myNewEndDate);

      setTramiteToEdit({
        ...editTramite,
        start: startDateInMs,
        finished: endDateInMs,
      });
      return;
    }
    setTramiteToEdit({
      ...editTramite,
      start: startDateInMs,
    });
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
      ...editTramite,
    };

    console.log(objectToSend);

    const response = await editExistingTramite(chamadoToEdit.key, objectToSend);

    if (response !== "success") {
      setError(response);
      return;
    }

    setError("");
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
        <div>
          <label className="border-b p-4">
            De
            <input
              name="hour"
              type="time"
              className="bg-transparent outline-none p-4 text-black placeholder:text-gray-600"
              onChange={handleTimeChange}
              value={timeInput.hour}
            />
            <input
              name="date"
              type="date"
              className="bg-transparent outline-none p-4 text-black placeholder:text-gray-600"
              onChange={handleTimeChange}
              value={timeInput.date}
            />
          </label>
          <label className="border-b p-4">
            Até
            <input
              name="endTime"
              type="time"
              className="bg-transparent outline-none p-4 text-black placeholder:text-gray-600"
              onChange={handleTimeChange}
              value={timeInput.endTime}
            />
            <input
              name="endDate"
              type="date"
              className="bg-transparent outline-none p-4 text-black placeholder:text-gray-600"
              onChange={handleTimeChange}
              value={timeInput.endDate}
            />
          </label>
        </div>
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
      {error ? <p className="text-red-600">{error}</p> : ""}
    </Modal>
  );
}
