import { useState } from "react";

function CriarChamado() {
  const [infoChamado, setInfoChamado] = useState({
    id: '',
    start: '',
    end: '',
    title: '',
    description: '',
    priority: '',
    inCharge: ''
  })

  function handleChange (e) {
    const { value } = e.target; 
    const { name } = e.target;
    setInfoChamado({...infoChamado, [name]: value})
  }

  function handleCadastro(e) {
    e.preventDefault();
    console.log(infoChamado)
  }

  return (
    <div className="h-screen w-full ">
      <form
        onSubmit={handleCadastro}
        className="w-[90%] h-[90%] mx-auto flex flex-col"
        action="sumbit"
      >
        <h1 className="text-black text-2xl mx-auto mt-16 mb-8 border-b border-gray-400">Detalhes do Chamado</h1>
        <input onChange={handleChange} name='id' value={infoChamado.id} placeholder="ID" className="inputCadastro" type="number" />
        <input onChange={handleChange} name='start' value={infoChamado.start} placeholder="Ínicio" className="inputCadastro" type="text" />
        <input onChange={handleChange} name='end' value={infoChamado.end} placeholder="Fim" className="inputCadastro" type="text" />
        <input onChange={handleChange} name='title' value={infoChamado.title} placeholder="Título" className="inputCadastro" type="text" />
        <input onChange={handleChange} name='description' value={infoChamado.description} placeholder="Descrição" className="inputCadastro" type="text" />
        <input onChange={handleChange} name='priority' value={infoChamado.priority} placeholder="Prioridade" className="inputCadastro" type="text" />
        <select onChange={handleChange} name='inCharge' value={infoChamado.inCharge} className="p-4 outline-none">
          <option defaultValue={true}>Flávio</option>
          <option>Patrícia</option>
          <option>Mônica</option>
        </select>
        <button className="btnCadastrar">Cadastrar</button>
      </form>
    </div>
  );
}

export default CriarChamado;
