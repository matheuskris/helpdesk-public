import { set } from "firebase/database";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { editExistingCall } from "../utils/firebase.utils";

Modal.setAppElement("#__next");

function EditCallModal({
  isEditModalOpen,
  setEditModal,
  callToEdit,
  setCallToEdit,
}) {
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [timeInput, setTimeInput] = useState({});
  const [oldId, setOldId] = useState({});

  useEffect(() => {
    setOldId(callToEdit.id);
    const newDateObject = new Date(callToEdit.start);

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

  // Modal's style
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
  // Close Modal
  function handleCloseModal() {
    setEditModal(false);
  }

  // just handlechange
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setCallToEdit({ ...callToEdit, [name]: value });
  }
  //
  useEffect(() => {
    const myDateString = timeInput.date + "T" + timeInput.hour;
    const myNewDate = new Date(myDateString);
    const dateInMs = Date.parse(myNewDate);
    setCallToEdit({ ...callToEdit, start: dateInMs });
  }, [timeInput]);
  //
  function handleTimeChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setTimeInput({ ...timeInput, [name]: value });
  }

  // Function Edit
  function handleEdit(e) {
    e.preventDefault();
    for (const prop in callToEdit) {
      if (callToEdit[prop] === "" || callToEdit[prop] === undefined) {
        console.log("failed", callToEdit[prop]);
        setIsRegisterFull(false);
        return;
      }
    }
    setEditModal(false);
    editExistingCall(callToEdit, oldId);
  }

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyle}
    >
      {callToEdit ? (
        <form
          onSubmit={handleEdit}
          className="w-[100%] h-[100%] mx-auto flex flex-col"
        >
          <h1 className="text-black text-2xl font-semibold mx-auto mt-6 mb-8 tracking-widest pb-1 border-b border-gray-400">
            Editar Chamado
          </h1>
          <input
            onChange={handleChange}
            name="id"
            value={callToEdit.id}
            placeholder="ID"
            className="inputCadastro"
            type="number"
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
          <input
            onChange={handleChange}
            name="client"
            value={callToEdit.client}
            placeholder="ID"
            className="inputCadastro"
            type="text"
          />
          <input
            onChange={handleChange}
            name="title"
            value={callToEdit.title}
            placeholder="Título"
            className="inputCadastro"
            type="text"
          />
          <input
            onChange={handleChange}
            name="description"
            value={callToEdit.description}
            placeholder="Descrição"
            className="inputCadastro"
            type="text"
          />
          <select
            onChange={handleChange}
            name="priority"
            value={callToEdit.priority}
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
            value={callToEdit.inCharge}
            className="p-4 outline-none inputCadastro"
          >
            <option defaultValue={true}>Responsável:</option>
            <option value="Flávio">Flávio</option>
            <option value="Patrícia">Patrícia</option>
            <option value="Mônica">Mônica</option>
          </select>
          <button className=" bg-blue-600 btnCadastrar">Salvar</button>
        </form>
      ) : (
        ""
      )}

      {isRegisterFull ? (
        ""
      ) : (
        <p className="text-red-600">Preencha Todos os Campos</p>
      )}
    </Modal>
  );
}

export default EditCallModal;
