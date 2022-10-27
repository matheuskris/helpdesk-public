import { useRouter } from "next/router";
import { useState } from "react";
import { addObjectToCollection } from "../src/utils/firebase.utils";

function CriarChamado() {
  const [infoCall, setInfoCall] = useState({
    id: "",
    start: "",
    title: "",
    description: "",
    priority: "",
    inCharge: "",
  });
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const router = useRouter();

  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setInfoCall({ ...infoCall, [name]: value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setInfoCall({ ...infoCall, start: new Date() });

    for (const prop in infoCall) {
      if (!infoCall[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }

    await addObjectToCollection("calls", infoCall);
    setInfoCall({
      id: "",
      start: "",
      title: "",
      description: "",
      priority: "",
      inCharge: "",
    });
    router.push("/helpdesk");
  }

  return (
    <div className="h-screen w-full ">
      <form
        onSubmit={handleRegister}
        className="w-[90%] h-[90%] mx-auto flex flex-col"
      >
        <h1 className="text-black text-2xl mx-auto mt-16 mb-8 border-b border-gray-400">
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
        <input
          onChange={handleChange}
          name="priority"
          value={infoCall.priority}
          placeholder="Prioridade"
          className="inputCadastro"
          type="text"
        />
        <select
          onChange={handleChange}
          name="inCharge"
          value={infoCall.inCharge}
          className="p-4 outline-none"
        >
          <option defaultValue={true}>Responsável</option>
          <option value="Flávio">Flávio</option>
          <option value="Patrícia">Patrícia</option>
          <option value="Mônica">Mônica</option>
        </select>
        <button className="btnCadastrar">Cadastrar</button>
        {isRegisterFull ? (
          ""
        ) : (
          <p className="text-red-600"> Preencha todos os campos</p>
        )}
      </form>
    </div>
  );
}

export default CriarChamado;
