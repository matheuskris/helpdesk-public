import { useEffect, useState } from "react";
import Modal from "react-modal";
import { editExistingCall } from "../utils/firebase.utils";
import { getStringDateToTimeInput } from "../utils/functions.utils";

Modal.setAppElement("#__next");

function EditCallModal({
  isEditModalOpen,
  setEditModal,
  callToEdit,
  setCallToEdit,
  userUid,
}) {
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [timeInput, setTimeInput] = useState({});
  const [oldId, setOldId] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setOldId(callToEdit.id);

    const startObj = getStringDateToTimeInput(callToEdit.start);
    const { hour, date } = startObj;
    let endTime = "";
    let endDate = "";
    if (callToEdit.finished) {
      const endObj = getStringDateToTimeInput(callToEdit.finished);
      endTime = endObj.hour;
      endDate = endObj.date;
    }
    setTimeInput({ date, hour, endTime, endDate });
  }, [isEditModalOpen]);

  useEffect(() => {
    setIsRegisterFull(true);
    setError("");
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
    const myStartDateString = timeInput.date + "T" + timeInput.hour;
    const myNewStartDate = new Date(myStartDateString);
    const startDateInMs = Date.parse(myNewStartDate);
    // if (!startDateInMs) {
    //   return;
    // }

    if (timeInput.endDate && timeInput.endTime) {
      const myEndDateString = timeInput.endDate + "T" + timeInput.endTime;
      const myNewEndDate = new Date(myEndDateString);
      const endDateInMs = Date.parse(myNewEndDate);

      setCallToEdit({
        ...callToEdit,
        start: startDateInMs,
        finished: endDateInMs,
      });
      return;
    }
    setCallToEdit({
      ...callToEdit,
      start: startDateInMs,
    });
  }, [timeInput]);
  //
  function handleTimeChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setTimeInput({ ...timeInput, [name]: value });
  }

  // Function Edit
  async function handleEdit(e) {
    e.preventDefault();
    console.log(callToEdit);
    for (const prop in callToEdit) {
      if (callToEdit[prop] === "") {
        setIsRegisterFull(false);
        return;
      }
    }
    const string = await editExistingCall(callToEdit, oldId);
    if (string === "success") {
      console.log("chamado editado com sucesso");
    } else {
      setError(string);
      return;
    }
    setEditModal(false);
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
          <input
            onChange={handleChange}
            name="client"
            value={callToEdit?.client}
            placeholder="Cliente"
            className="inputCadastro"
            type="text"
          />
          <input
            onChange={handleChange}
            name="userClient"
            value={callToEdit?.userClient}
            placeholder="Usuário Cliente"
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
      {error ? <p className="text-red-600">{error}</p> : ""}
    </Modal>
  );
}

export default EditCallModal;
