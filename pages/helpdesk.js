import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { callsListener, writeNewCall } from "../src/utils/firebase.utils";
import CreateCallModal from "../src/components/CreateCallModal";
import EditCallModal from "../src/components/EditCallModal";
import DescriptionModal from "../src/components/DescriptionModal";
import FollowUpModal from "../src/components/FollowUpModal";
import { setCalls } from "../src/store/callsSlicer/callsSlicer";
import { useDispatch, useSelector } from "react-redux";
import Table from "../src/components/Table";
import { downloadTableDataInExcel } from "../src/utils/xlsx.utils";
import { getBeatyDate } from "../src/utils/functions.utils";
import { setUser } from "../src/store/userSlicer/userSlicer";
import { selectUser } from "../src/store/userSlicer/user.selector";

function Helpdesk() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userUid = user?.uid;
  // D A T A
  const [chamados, setChamados] = useState([]);
  // M O D A I S
  const [isModalOpen, setModal] = useState(false);
  const [isFollowUpModalOpen, setFollowUpModal] = useState(false);
  const [followUpChamado, setFollowUpChamado] = useState({});
  const [isEditModalOpen, setEditModal] = useState(false);
  const [callToEdit, setCallToEdit] = useState({});
  const [isDescriptionModalOpen, setDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  // F I L T E R
  const [filterOrderBy, setFilterOrderBy] = useState("id");
  const [isOrderInverted, setIsInvertedOrder] = useState(false);
  const [showClosedCalls, setClosedCalls] = useState(false);
  const [selectFilter, setSelectFilter] = useState("id");
  const [searchField, setSearchField] = useState("");
  const [date1, setDate1] = useState({});
  const [date2, setDate2] = useState({});

  // checking if the user is authenticated if not, pushing to login page
  useEffect(() => {
    if (user) {
      return;
    } else {
      router.push("/");
    }
  }, []);

  // Logaut logic
  function logout() {
    dispatch(setUser(null));
  }
  // fetching calls from firebase
  useEffect(() => {
    const transformObjectToArray = (object) => {
      const newObject = Object.assign({}, object);
      dispatch(setCalls(newObject));

      const newArray = [];
      for (const prop in object) {
        newArray.push(object[prop]);
      }
      setChamados(newArray);
    };

    callsListener(userUid, transformObjectToArray);
  }, []);

  // useEffect(() => {
  //   const callsToStore = [...chamados];
  //   dispatch(setCalls(callsToStore));
  // }, [chamados]);

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
        return b.start - a.start;
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
    if (selectFilter === "data") {
      const X = call.start >= Date.parse(date1);
      const Y = call.start <= Date.parse(date2) + 84600000;
      if (showClosedCalls) {
        return call.isClosed && X && Y;
      } else {
        return !call.isClosed && X && Y;
      }
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

  if (isOrderInverted) {
    filteredCalls.reverse();
  }

  // não está funcionando totalmente, resolver depois
  function handleFilter(collumName) {
    if (filterOrderBy === collumName) {
      setIsInvertedOrder(!isOrderInverted);
    } else {
      setFilterOrderBy(collumName);
      setIsInvertedOrder(false);
    }
  }

  // Close Call
  function handleCloseCall(callToClose) {
    const newDate = new Date();
    const dateToSend = Date.parse(newDate);

    writeNewCall({ ...callToClose, finished: dateToSend, isClosed: true });
  }

  // M O D A I S
  function checkDescription(desc) {
    setDescriptionModal(true);
    setDescription(desc);
  }

  function handleOpenModal() {
    setModal(true);
  }

  function handleEditModal(chamado) {
    setEditModal(true);
    setCallToEdit(chamado);
  }

  function handleShowFollowUp(chamado) {
    setFollowUpModal(true);
    setFollowUpChamado(chamado);
  }

  function handleReopenCall(chamado) {
    writeNewCall({ ...chamado, isClosed: false });
  }

  function handleShowClosedCalls() {
    setClosedCalls(!showClosedCalls);
  }
  // F I L T E R
  function handleOnChangeDate1(e) {
    const { value } = e.target;
    setDate1(value);
  }

  function handleOnChangeDate2(e) {
    const { value } = e.target;
    setDate2(value);
  }
  function handleDownload() {
    let objectToExport = [];
    filteredCalls.forEach((element) => {
      const {
        client,
        description,
        id,
        inCharge,
        priority,
        start,
        title,
        finished,
        followUp,
      } = element;
      objectToExport.push({
        id: id,
        Cliente: client,
        Título: title,
        Descrição: description,
        Acompanhamento: followUp,
        Prioridade: priority,
        Responsável: inCharge,
        Início: getBeatyDate(start),
        Término: getBeatyDate(finished),
      });
    });
    downloadTableDataInExcel(objectToExport);
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
              {selectFilter === "data" ? (
                ""
              ) : (
                <h3 className="text-lg border-b border-black ">
                  Escolha um filtro:
                </h3>
              )}
              <select
                className="rounded-lg p-2 border text-sm outline-gray-400"
                onChange={handleSelectChange}
              >
                <option value="id">Id</option>
                <option value="client">Cliente</option>
                <option value="inCharge">Responsável</option>
                <option value="data">Data</option>
              </select>
              {selectFilter === "data" ? (
                <>
                  <input
                    type="date"
                    name="searchField"
                    value={date1}
                    onChange={handleOnChangeDate1}
                    className="p-2 rounded-lg border text-sm outline-gray-400 mx-3"
                  />
                  <input
                    type="date"
                    name="searchField"
                    value={date2}
                    onChange={handleOnChangeDate2}
                    className="p-2 rounded-lg border text-sm outline-gray-400"
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
          <Table
            handleFilter={handleFilter}
            showClosedCalls={showClosedCalls}
            filteredCalls={filteredCalls}
            checkDescription={checkDescription}
            handleShowFollowUp={handleShowFollowUp}
            handleEditModal={handleEditModal}
            handleReopenCall={handleReopenCall}
            handleCloseCall={handleCloseCall}
          />
        </div>
        <div className="w-[95%] mt-4 flex items-center justify-end mx-auto">
          <button className="btnExport bg-black" onClick={logout}>
            Sair
          </button>
          <button className="btnExport" onClick={handleDownload}>
            Exportar para Excel
          </button>
          <Image
            className=""
            src="/excel.svg"
            width={48}
            height={48}
            alt="logo excel"
          />
        </div>

        {/* === Configuração do Modal =====  */}
        <CreateCallModal
          userUid={userUid}
          isModalOpen={isModalOpen}
          setModal={setModal}
        />
        <EditCallModal
          userUid={userUid}
          isEditModalOpen={isEditModalOpen}
          setEditModal={setEditModal}
          callToEdit={callToEdit}
          setCallToEdit={setCallToEdit}
        />
        <FollowUpModal
          userUid={userUid}
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
