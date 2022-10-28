import { useState } from "react";
import Modal from "react-modal";
import { writeNewCall } from "../utils/firebase.utils";

Modal.setAppElement("#__next");

function EditCallModal({
  isEditModalOpen,
  setEditModal,
  callToEdit,
  setCallToEdit,
}) {
  const [isRegisterFull, setIsRegisterFull] = useState(true);

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

  // Function Edit
  function handleEdit(e) {
    e.preventDefault();

    for (const prop in callToEdit) {
      if (!callToEdit[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }
    setEditModal(false);
    writeNewCall(callToEdit);
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
