import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { callsListener } from "../src/utils/firebase.utils";
import CreateCallModal from "../src/components/CreateCallModal";
import EditCallModal from "../src/components/EditCallModal";
import DescriptionModal from "../src/components/DescriptionModal";
import FollowUpModal from "../src/components/FollowUpModal";

function Helpdesk() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  const [isEditModalOpen, setEditModal] = useState(false);
  const [isDescriptionModalOpen, setDescriptionModal] = useState(false);
  const [isFollowUpModalOpen, setFollowUpModal] = useState(false);
  const [closedCalls, setClosedCalls] = useState([]);
  const [description, setDescription] = useState("");

  // checking if the user is authenticated if not, pushing to login page
  useEffect(() => {
    if (localStorage.getItem("user")) {
      return;
    } else {
      router.push("/");
    }
  });

  // open modal
  function handleOpenModal() {
    setModal(true);
  }

  // fetching calls from firebase
  useEffect(() => {
    const transformObjectToArray = (object) => {
      const newArray = [];
      for (const prop in object) {
        newArray.push(object[prop]);
      }
      setChamados(newArray);
    };
    callsListener(transformObjectToArray);
  }, []);

  // Logaut logic
  function logout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  // handleCloseCall
  function handleCloseCall(id) {
    const chosenCall = chamados.filter((chamado) => chamado.id === id);
    setClosedCalls([...closedCalls, chosenCall]);
  }

  // opening the modal and setting the description to get in the modal
  function checkDescription(desc) {
    setDescriptionModal(true);
    setDescription(desc);
  }

  function handleDetails({ id }) {
    setFollowUpModal(true);
  }

  return (
    <div className="h-screen w-full relative bg-[#FFF]">
      {/* Aside */}
      <div className="flex-col flex fixed w-[13%] h-full bg-[#c4c4c4]">
        {/* Titulo e SVG Menu */}
        <div className="flex items-center justify-between mt-4 mx-4">
          <h1 className="text-lg font-semibold text-white">Help Desk</h1>
          <Image
            className="cursor-pointer"
            width={24}
            height={24}
            src="/menu.svg"
            alt="Ícone Menu"
          />
        </div>

        {/* Opções */}
        <div className="flex flex-col gap-2 w-[100%] mt-auto mb-4">
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

      {/* Content */}
      <div className="ml-[13%] px-6 ">
        {/* Titulo tabela e botão  */}
        <div className="flex justify-between items-center pt-[50px]">
          <h1 className="pl-10 text-3xl font-semibold mb-2">
            Painel de Controle
          </h1>
          <button onClick={handleOpenModal} className="btnAddChamado">
            Abrir um chamado
          </button>
        </div>

        {/* Tabela */}
        <div className="rounded-[30px] overflow-hidden">
          <table className=" bg-white h-auto w-full border-collapse text-lg ">
            <thead>
              <tr className="bg-[#c4c4c4] text-white text-left">
                <th className="th ">ID</th>
                <th className="th ">Data Inicial</th>
                <th className="th ">Título</th>
                <th className="th ">Descrição</th>
                <th className="th">Follow up</th>
                <th className="th ">Prioridade</th>
                <th className="th ">Responsável</th>
                <th className="th "></th>
                <th className="th "></th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((chamado) => (
                <tr
                  key={chamado.id}
                  className="border-b border-[#dddddd] even:bg-gray-200 mb-4"
                >
                  <td className="td">{chamado.id}</td>
                  <td className="td">{chamado.start.day}</td>
                  <td className="td">{chamado.title}</td>
                  <td
                    onClick={() => checkDescription(chamado.description)}
                    className="td cursor-pointer whitespace-nowrap truncate"
                  >
                    {chamado.description}
                  </td>
                  <td className="td">
                    <button
                      onClick={() => handleDetails(chamado)}
                      className="btnDetails"
                    >
                      Detalhes
                    </button>
                  </td>
                  <td className="td flex justify-around items-center">
                    {chamado.priority}{" "}
                    {chamado.priority === "Alta" && (
                      <Image width={30} height={30} src="/High Priority.png" alt="Alta" />
                    )}
                    {chamado.priority === "Média" && (
                      <Image width={30} height={30} src="/Medium Priority.png" alt="Média" />
                    )}
                    {chamado.priority === "Baixa" && (
                      <Image width={30} height={30} src="/Low Priority.png" alt="Baixa" />
                    )}
                  </td>
                  <td className="td">{chamado.inCharge}</td>
                  <td className="td">
                    <button
                      onClick={() => setEditModal(true)}
                      className="btnEdit"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="td">
                    <button
                      onClick={() => handleCloseCall(chamado.id)}
                      className="btnCloseCall"
                    >
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
        <EditCallModal
          isEditModalOpen={isEditModalOpen}
          setEditModal={setEditModal}
        />
        <FollowUpModal 
          isFollowUpModalOpen={isFollowUpModalOpen}
          setFollowUpModal={setFollowUpModal}
        />
        <DescriptionModal
          isDescriptionModalOpen={isDescriptionModalOpen}
          setDescriptionModal={setDescriptionModal}
          description={description}
        />
      </div>
    </div>
  );
}

export default Helpdesk;
