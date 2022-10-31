import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { callsListener, writeNewCall } from "../src/utils/firebase.utils";
import CreateCallModal from "../src/components/CreateCallModal";
import EditCallModal from "../src/components/EditCallModal";
import DescriptionModal from "../src/components/DescriptionModal";
import FollowUpModal from "../src/components/FollowUpModal";
import { initialCall } from "../src/components/CreateCallModal";
import { parse } from "postcss";

function Helpdesk() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);

  const [isModalOpen, setModal] = useState(false);
  const [isFollowUpModalOpen, setFollowUpModal] = useState(false);

  const [isEditModalOpen, setEditModal] = useState(false);
  const [callToEdit, setCallToEdit] = useState(initialCall);

  const [isDescriptionModalOpen, setDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  const [filterOrderBy, setFilterOrderBy] = useState("id");
  const [showClosedCalls, setClosedCalls] = useState(false);

  // FOLLOW UP STATE
  const [followUpChamado, setFollowUpChamado] = useState({});

  const orderedCalls = chamados.sort(function (a, b) {
    switch (filterOrderBy) {
      case "start":
        return a.start?.hour - b.start?.hour;
      case "id":
        return a.id - b.id;
      case "inCharge":
        let xIC = a.inCharge?.toLowerCase();
        let yIC = b.inCharge?.toLowerCase();
        if (xIC < yIC) {
          return -1;
        }
        if (xIC > yIC) {
          return 1;
        }
        return 0;
      case "title":
        let xt = a.title?.toLowerCase();
        let yt = b.title?.toLowerCase();
        if (xt < yt) {
          return -1;
        }
        if (xt > yt) {
          return 1;
        }
        return 0;
      case "priority":
        let xP = a.priority?.toLowerCase();
        let yP = b.priority?.toLowerCase();
        if (xP < yP) {
          return -1;
        }
        if (xP > yP) {
          return 1;
        }
        return 0;
      case "client":
        let xC = a.client?.toLowerCase();
        let yC = b.client?.toLowerCase();
        if (xC < yC) {
          return -1;
        }
        if (xC > yC) {
          return 1;
        }
        return 0;
    }
  });

  const filteredCalls = orderedCalls.filter((call) => {
    if (showClosedCalls) {
      return call.isClosed;
    } else {
      return !call.isClosed;
    }
  });

  // não está funcionando, resolver depois
  function handleFilter(filterId) {
    if (filterOrderBy === filterId) {
      filteredCalls.reverse();
    } else {
      setFilterOrderBy(filterId);
    }
  }

  // showing ongoingTime of call
  function showOnGoingTime(parsedDate) {
    const currentDate = new Date();
    const callDate = new Date(parsedDate);

    const timePassedInSecs = (currentDate - callDate) / 1000;
    if (timePassedInSecs < 60) {
      return `${timePassedInSecs.toFixed(0)} seg`;
    }
    const timePassedInMin = timePassedInSecs / 60;
    if (timePassedInSecs < 3600) {
      return `${timePassedInMin.toFixed(0)} min`;
    }
    const timePassedInHoras = timePassedInMin / 60;
    const minPassHour = timePassedInMin % 60;
    if (timePassedInSecs < 86400) {
      return `${timePassedInHoras.toFixed(0)} hr ${minPassHour.toFixed(0)} min`;
    }
    const daysPassed = timePassedInHoras / 24;
    return `${daysPassed.toFixed(0)} dias`;
  }

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

  // handle Get Beautifull Data
  function getBeatyDate() {
    const date = new Date();

    return {
      day: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    };
  }

  // Close Call
  function handleCloseCall(callToClose) {
    const newDate = getBeatyDate();

    writeNewCall({ ...callToClose, finished: newDate, isClosed: true });
  }

  // open modal
  function handleOpenModal() {
    setModal(true);
  }

  // opening the modal and setting the description to get in the modal
  function checkDescription(desc) {
    setDescriptionModal(true);
    setDescription(desc);
  }

  // Edit Modal
  function handleEditModal(chamado) {
    setEditModal(true);
    setCallToEdit(chamado);
  }

  // FOLLOW UP FUNCTION
  function handleShowFollowUp(chamado) {
    setFollowUpModal(true);
    setFollowUpChamado(chamado);
  }

  function handleShowClosedCalls() {
    setClosedCalls(!showClosedCalls);
  }

  function handleReopenCall(chamado) {
    writeNewCall({ ...chamado, isClosed: false });
  }




  function exportReport(){
    const XLSX = require('xlsx')
    // array of objects to save in Excel
    let binary_univers = filteredCalls;
  
    let binaryWS = XLSX.utils.json_to_sheet(binary_univers); 
    
    // Create a new Workbook
    var wb = XLSX.utils.book_new() 
  
    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, 'relatorio mes 1') 
  
    // export your excel
    XLSX.writeFile(wb, 'relatorio mes 1.xlsx');
  }





  
  return (
    <div className="h-screen w-full relative bg-[#FFF]">
      {/* Aside */}

      {/* Final Aside */}

      {/* Content */}
      <div className=" px-6 ">
        {/* Titulo tabela e botão  */}
        <div className="flex justify-between items-center pt-[50px]">
          <h1 className="pl-10 text-3xl font-semibold mb-2">
            Painel de Controle
          </h1>
          <div className="">
            <button className="" onClick={exportReport}>Exportar</button>
            {showClosedCalls ? (
              <button
                onClick={handleShowClosedCalls}
                className="btnShowClosedCalls bg-green-600 hover:bg-green-700"
              >
                Visualizar Chamados Abertos
              </button>
            ) : (
              <button
                onClick={handleShowClosedCalls}
                className="btnShowClosedCalls"
              >
                Visualizar Chamados Fechados
              </button>
            )}

            <button onClick={handleOpenModal} className="btnAddChamado">
              Abrir um chamado
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-[30px] overflow-hidden w-[95%] mx-auto">
          <table className=" bg-white h-auto w-[100%] overflow-x-scroll text-lg ">
            <thead>
              <tr className="bg-[#c4c4c4] text-white text-left">
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("id");
                  }}
                >
                  ID
                </th>
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("client");
                  }}
                >
                  Cliente
                </th>
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("start");
                  }}
                >
                  Data Inicial
                </th>
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("title");
                  }}
                >
                  Título
                </th>
                <th className="th">Descrição</th>
                <th className="th">Follow up</th>
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("priority");
                  }}
                >
                  Prioridade
                </th>
                <th
                  className="th"
                  onClick={() => {
                    handleFilter("inCharge");
                  }}
                >
                  Responsável
                </th>
                <th className="th"></th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((chamado) => (
                <tr
                  key={chamado.id}
                  className="border-b border-[#dddddd] even:bg-gray-200 mb-4"
                >
                  <td className="td">{chamado.id}</td>
                  <td className="td">{chamado?.client}</td>
                  <td className="td">{showOnGoingTime(chamado.start)}</td>
                  <td className="td">{chamado.title}</td>
                  <td
                    onClick={() => checkDescription(chamado.description)}
                    className="td"
                  >
                    {chamado.description}
                  </td>
                  <td className="td">
                    <button
                      onClick={() => handleShowFollowUp(chamado)}
                      className="btnDetails"
                    >
                      Detalhes
                    </button>
                  </td>
                  <td className="td flex justify-around items-center">
                    {chamado.priority}{" "}
                    {chamado.priority === "Alta" && (
                      <Image
                        width={30}
                        height={30}
                        src="/High Priority.png"
                        alt="Alta"
                      />
                    )}
                    {chamado.priority === "Média" && (
                      <Image
                        width={30}
                        height={30}
                        src="/Medium Priority.png"
                        alt="Média"
                      />
                    )}
                    {chamado.priority === "Baixa" && (
                      <Image
                        width={30}
                        height={30}
                        src="/Low Priority.png"
                        alt="Baixa"
                      />
                    )}
                  </td>
                  <td className="td">{chamado.inCharge}</td>
                  <td className="td">
                    <button
                      onClick={() => handleEditModal(chamado)}
                      className="btnEdit"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="td">
                    {showClosedCalls ? (
                      <button
                        onClick={() => handleReopenCall(chamado)}
                        className="btnReopenCall"
                      >
                        Reabrir
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCloseCall(chamado)}
                        className="btnCloseCall"
                      >
                        Finalizar
                      </button>
                    )}
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
          callToEdit={callToEdit}
          setCallToEdit={setCallToEdit}
        />
        <FollowUpModal
          isFollowUpModalOpen={isFollowUpModalOpen}
          setFollowUpModal={setFollowUpModal}
          followUpChamado={followUpChamado}
          setFollowUpChamado={setFollowUpChamado}
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
