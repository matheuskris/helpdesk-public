import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getObjectsOfCollection } from "../src/utils/firebase.utils";
import CreateCallModal from "../src/components/CreateCallModal";
import EditCallModal from "../src/components/EditCallModal";
import DescriptionModal from "../src/components/DescriptionModal";

function Helpdesk() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  const [isEditModalOpen, setEditModal] = useState(false);
  const [isDescriptionModalOpen, setDescriptionModal] = useState(false);
  const [closedCalls, setClosedCalls] = useState([]);
  const [description, setdesc] = useState('')

  // open modal
  function handleOpenModal() {
    setModal(true);
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
    getObjectsOfCollection("calls").then((calls) => setChamados(calls));
  }, []);

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

  // handleCloseCall
  function handleCloseCall(id) {
    const chosenCall = chamados.filter(chamado => chamado.id === id)
    setClosedCalls([...closedCalls, chosenCall])
  }

  // opening the modal and setting the description to get in the modal
  function checkDescription (desc) {
    setDescriptionModal(true)
    setdesc(desc)
  }


  return (
    <div className="h-screen w-full relative bg-[#FFF]">
      {/* Aside */}
      <div className=" fixed sm:w-[60px] lg:w-[136px] lg:h-full bg-[#c4c4c4]">
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
              <th className="th w-10">ID</th>
              <th className="th w-10">Data Inicial</th>
              <th className="th w-10">Data Término</th>
              <th className="th w-10">Título</th>
              <th className="th w-16">Descrição</th>
              <th className="th w-10">Prioridade</th>
              <th className="th w-10">Responsável</th>
              <th className="th w-10"></th>
              <th className="th w-10"></th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado) => (
              <tr
                key={chamado.id}
                className="border-b border-[#dddddd] even:bg-gray-200 mb-4"
              >
                <td className="td">{chamado.id}</td>
                <td className="td">26/10/2022</td>
                <td className="td">26/10/2022</td>
                <td className="td">{chamado.title}</td>
                <td onClick={() => checkDescription(chamado.description)} className="td cursor-pointer whitespace-nowrap truncate">{chamado.description}</td>
                <td className="td">{chamado.priority}</td>
                <td className="td">{chamado.inCharge}</td>
                <td className="td">
                  <button onClick={() => setEditModal(true)} className="btnEdit">
                    Editar
                  </button>
                </td>
                <td className="td">
                  <button onClick={() => handleCloseCall(chamado.id)} className="btnCloseCall">
                    Finalizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Configuração do Modal =====  */}
      <CreateCallModal isModalOpen={isModalOpen} setModal={setModal} />
      <EditCallModal isEditModalOpen={isEditModalOpen} setEditModal={setEditModal} />
      <DescriptionModal description={description} isDescriptionModalOpen={isDescriptionModalOpen} setDescriptionModal={setDescriptionModal} />
    </div>
  );
}

export default Helpdesk;
