import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getObjectsOfCollection } from '../src/utils/firebase.utils';
import Modal from 'react-modal';

Modal.setAppElement('#__next')

function Helpdesk() {
  const router = useRouter();
  const [infoCall, setInfoCall] = useState({
    id: "",
    start: "",
    title: "",
    description: "",
    priority: "",
    inCharge: "",
  });
  const [isRegisterFull, setIsRegisterFull] = useState(true);
  const [chamados, setChamados] = useState([]);
  const [modalIsOpen, setModal] = useState(false)

  // ====== Funções do Modal =========
  function handleOpenModal() {
    setModal(true);
  }
  function handleCloseModal() {
    setModal(false)
  }
  // Estilo do Modal
  const customStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '24px',
    }
  }
  // adding new call to firebase thru the modal
  async function handleRegister(e) {
    e.preventDefault();
    data = new Date();
    const objectToSend = { ...infoCall, start:`${data.getDate()}/${
      data.getMonth() + 1
    }/${data.getFullYear()} às ${data.getHours()}:${data.getMinutes()}` };

    console.log(objectToSend)
    for (const prop in objectToSend) {
      if (!objectToSend[prop]) {
        setIsRegisterFull(false);
        return;
      }
    }

    await addObjectToCollection("calls", objectToSend);
    setInfoCall({
      id: "",
      start: "",
      title: "",
      description: "",
      priority: "",
      inCharge: "",
    });
    window.location.reload();
  }


  // Normal handle change
  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    setInfoCall({ ...infoCall, [name]: value });
  }

  // checking if the user is authenticated if not, pushing to login page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      return;
    } else {
      router.push("/");
    }
  });

  // fetching calls from firebase
  useEffect(() => {
    getObjectsOfCollection('calls')
      .then((calls) => setChamados(calls))

  }, [])

  // Test data
  useEffect(()=> {
    const datahoje =  new Date()
    console.log(datahoje.toDateString())
    console.log("oi gente")
  },[chamados])

  // just an example of what the date should look like
  function getBeatyDate(date) {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} às ${date.getHours()}:${date.getMinutes()}`;
  }

  // Logaut logic
  function logout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  return (
    <div className="h-screen w-full relative bg-[#FFF]">
      {/* Aside */}
      <div className="lg:absolute lg:w-[136px] lg:h-full bg-[#c4c4c4]">
        {/* Titulo e SVG Menu */}
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold text-white py-4 px-2">
            Help Desk
          </h1>
          <Image
            className="cursor-pointer"
            width={24}
            height={24}
            src="/menu.svg"
            alt="Ícone Menu"
          />
        </div>

        {/* Opções */}
        <div className="w-[100%] lg:mt-[575px] 2xl:mt-[580px] space-y-2">
          <div className="opcoes">
            <Image
              src="/phone.svg"
              width={18}
              height={18}
              alt="Ícone Telefone"
            />
            <p className="mx-1">Contato</p>
          </div>
          <div className="opcoes">
            <Image
              src="/mdi_help-circle-outline.svg"
              width={18}
              height={18}
              alt="Ícone Ajuda"
            />
            <p className="mx-1">Ajuda</p>
          </div>
          <div className="opcoes">
            <Image
              src="/mdi_login.svg"
              width={18}
              height={18}
              alt="Ícone Sair"
            />
            <p onClick={logout} className="mx-1 cursor-pointer">
              Sair
            </p>
          </div>
        </div>
      </div>
      {/* Final Aside */}

      {/* Titulo tabela e botão  */}
      <div className="flex justify-between items-center pt-[50px]">
        <h1 className=" text-3xl font-semibold ml-[136px] pl-16 mb-2">
          Painel de Controle
        </h1>
        <button onClick={handleOpenModal} className="btnAddChamado">
          Abrir um chamado
        </button>
        
      </div>

      {/* Tabela */}
      <div className=" mx-auto flex justify-center items-center ml-[136px]">
        <table className=" bg-white  h-auto 2xl:w-[1650px]  rounded-3xl border-collapse mx-[60px] my-0 text-lg ">
          <thead>
            <tr className="bg-[#c4c4c4] text-white text-left">
              <th className="th">ID Chamado</th>
              <th className="th">Data Inicial</th>
              <th className="th">Data Término</th>
              <th className="th">Título</th>
              <th className="th">Descrição</th>
              <th className="th">Prioridade</th>
              <th className="th">Responsável</th>
              <th className="th"></th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado) => (
              <tr
                key={chamado.id}
                className="border-b border-[#dddddd] even:bg-gray-200"
              >
                <td className="td">{chamado.id}</td>
                <td className="td">26/10/2022</td>
                <td className="td">26/10/2022</td>
                <td className="td">{chamado.title}</td>
                <td className="td">{chamado.description}</td>
                <td className="td">{chamado.priority}</td>
                <td className="td">{chamado.inCharge}</td>
                <td className="td"><button className='p-2 rounded-lg font-semibold cursor-pointer bg-yellow-300'>Editar</button></td>
                <td className="td"><button className="p-2 rounded-lg font-semibold cursor-pointer bg-red-500">Finalizar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* === Configuração do Modal =====  */}
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
          style={customStyle}
        >
          <form
        onSubmit={handleRegister}
        className="w-[100%] h-[100%] mx-auto flex flex-col"
      >
        <h1 className="text-black text-2xl mx-auto mt-10 mb-8 border-b border-gray-400">
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
          <option value="Flávio">Flávio</option>
          <option value="Patrícia">Patrícia</option>
          <option value="Mônica">Mônica</option>
        </select>
        <button className="btnCadastrar">Cadastrar</button>
        </form>
      </Modal>

      
    </div>
  );
}

export default Helpdesk;
