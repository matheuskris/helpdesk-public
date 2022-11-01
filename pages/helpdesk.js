import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { callsListener, writeNewCall } from "../src/utils/firebase.utils";
import CreateCallModal from "../src/components/CreateCallModal";
import EditCallModal from "../src/components/EditCallModal";
import DescriptionModal from "../src/components/DescriptionModal";
import FollowUpModal from "../src/components/FollowUpModal";
import { initialCall } from "../src/components/CreateCallModal";
import { setCalls } from "../src/store/callsSlicer/callsSlicer";
import { useDispatch } from "react-redux";

import { getTimeStringFromMs } from "../src/utils/functions.utils";

function Helpdesk() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [chamados, setChamados] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  const [isFollowUpModalOpen, setFollowUpModal] = useState(false);
  const [followUpChamado, setFollowUpChamado] = useState({});
  const [isEditModalOpen, setEditModal] = useState(false);
  const [callToEdit, setCallToEdit] = useState(initialCall);
  const [isDescriptionModalOpen, setDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  const [filterOrderBy, setFilterOrderBy] = useState("id");
  const [showClosedCalls, setClosedCalls] = useState(false);
  const [selectFilter, setSelectFilter] = useState("id");
  const [searchField, setSearchField] = useState(""); 
  const [date1, setDate1] = useState(new Date())
  const [date2, setDate2] = useState(new Date())

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
    const transformObjectToArray = (object) => {
      const newArray = [];
      for (const prop in object) {
        newArray.push(object[prop]);
      }
      setChamados(newArray);
    };

    callsListener(transformObjectToArray);
  }, []);

  useEffect(() => {
    const callsToStore = [...chamados];
    dispatch(setCalls(callsToStore));
  }, [chamados]);

  function handleSelectChange(e) {
    const { value } = e.target;
    console.log(value);
    setSelectFilter(value);
  }
  function handleSearchField(e) {
    const { value } = e.target;
    setSearchField(value);
  }

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
    if(selectFilter === 'data') {
      let X = new Date(call.start) >= date1
      let Y = new Date(call.finished) <= date2
      console.log(X,)
      return !call.isClosed && X && Y
    } else {
      let doesCallIsSearched = call[selectFilter]
          .toLowerCase()
          .includes(searchField.toLowerCase());
      if (showClosedCalls) {
        return call.isClosed && doesCallIsSearched;
      } else {
        return !call.isClosed && doesCallIsSearched;
      }
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

    return getTimeStringFromMs(currentDate - callDate);
  }

  function showTimeSpent(chamado) {
    const timeSpentinMs = chamado.finished - chamado.start;
    return getTimeStringFromMs(timeSpentinMs);
  }
  // open modal
  function handleOpenModal() {
    setModal(true);
  }

  // Logaut logic
  function logout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  // handle Get Beautifull Data
  // function getBeatyDate() {
  //   const date = new Date();

  //   return {
  //     day: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
  //     hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
  //   };
  // }

  // Close Call
  function handleCloseCall(callToClose) {
    const newDate = new Date();
    const dateToSend = Date.parse(newDate);

    writeNewCall({ ...callToClose, finished: dateToSend, isClosed: true });
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

  function handleOnChangeDate1(e){
    const { value } = e.target;
    setDate1(value)
  }

  function handleOnChangeDate2(e){
    const { value } = e.target;
    setDate2(value)
  }

  function exportReport() {
    const XLSX = require("xlsx");
    // array of objects to save in Excel
    let binary_univers = filteredCalls;

    let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

    // Create a new Workbook
    var wb = XLSX.utils.book_new();

    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, "Dê um nome ao seu relatório");

    // export your excel
    XLSX.writeFile(wb, "Dê um nome ao seu relatório.xlsx");
  }

  return (
    <div className="h-screen w-full relative bg-[#FFF]">
      {/* Content */}
      <div className=" px-6 ">
        {/* Titulo tabela e botão  */}
        <div className="flex flex-row justify-between items-center pt-[20px] mb-4">
          <div className="pl-10 flex">
            <h1 className="text-3xl font-semibold mb-2">Painel de Controle</h1>
          </div>
          <div className="flex gap-4 place-self-end mr-12">
            <div className="flex items-center justify-between">
              <h3 className="text-xl border-b border-black ">Escolha um filtro:</h3>
              <select className="rounded-lg p-2 border text-base outline-gray-400" onChange={handleSelectChange}>
                <option value="id">Id</option>
                <option value="client">Cliente</option>
                <option value="inCharge">Responsável</option>
                <option value="data">Data</option>
              </select>
              {selectFilter === 'data' ? (
                <>
                  <input
                  type="date"
                  name="searchField"
                  onChange={handleOnChangeDate1}
                  className="p-2 rounded-lg border text-base w-[20%] outline-gray-400"
                />
                  <input
                    type="date"
                    name="searchField"
                    onChange={handleOnChangeDate2}
                    className="p-2 rounded-lg border text-base w-[20%] outline-gray-400"
                  />
                </>
              ) : (
                <input
                  type="text"
                  name="searchField"
                  onChange={handleSearchField}
                  className="p-2 rounded-lg border text-base w-[30%] outline-gray-400"
                />
              )}
            </div>
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
                {showClosedCalls ? <th className="th">Tempo Consumido</th> : ""}
                <th className="th"></th>
                {showClosedCalls ? "" : <th className="th"></th>}
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
                    className="td cursor-pointer whitespace-nowrap truncate max-w-[350px]"
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
                  <td className="td flex justify-around items-center ">
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
                  {showClosedCalls ? (
                    <td className="td">{showTimeSpent(chamado)}</td>
                  ) : (
                    <td className="td">
                      <button
                        onClick={() => handleEditModal(chamado)}
                        className="btnEdit"
                      >
                        Editar
                      </button>
                    </td>
                  )}
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
          <div className="w-[100%] mt-4 flex items-center justify-end">
            <button className="btnExport" onClick={exportReport}>
              Exportar para Excel
            </button>
            <Image className="" src="/SVG excel.svg" width={48} height={48} />
          </div>
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
