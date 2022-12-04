import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { callsListener, editExistingCall } from "../../utils/firebase.utils";

import { setCalls } from "../../store/callsSlicer/callsSlicer";
import { downloadTableDataInExcel } from "../../utils/xlsx.utils";
import {
  selectProject,
  selectUser,
} from "../../store/userSlicer/user.selector";
import { getBeatyDate, getMonthTimeObject } from "../../utils/functions.utils";

export function useHelpdesk() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const project = useSelector(selectProject);

  const userUid = user?.uid;
  // D A T A
  const [chamados, setChamados] = useState([]);
  // M O D A I S
  const [isModalOpen, setModal] = useState(false);
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
  const [dateInput, setDateInput] = useState({
    date1: "",
    date2: "",
  });
  // T O T A L   T I M E
  const [totalTime, setTotalTime] = useState({});

  const personsInProject = Object.values(project?.users);

  const [month, setMonth] = useState({
    month: 11,
    year: 2022,
  });
  // checking if the user is authenticated if not, pushing to login page
  useEffect(() => {
    if (user) {
      return;
    } else {
      router.push("/");
    }
  }, []);

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

    callsListener(project.key, transformObjectToArray);
  }, []);

  // throwing calls to redux
  useEffect(() => {
    const callsToStore = [...chamados];
    dispatch(setCalls(callsToStore));
  }, [chamados]);

  useEffect(() => {
    setTotalTime(getMonthTimeObject(chamados, month.month, month.year));
  }, [month, chamados]);

  function handleSelectChange(e) {
    const { value } = e.target;
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
      const X = call.start >= Date.parse(dateInput.date1);
      const Y = call.start <= Date.parse(dateInput.date2) + 84600000;
      if (showClosedCalls) {
        return call.isClosed && X && Y;
      } else {
        return !call.isClosed && X && Y;
      }
    } else {
      let propFilter = call[selectFilter];
      if (!propFilter) {
        propFilter = "";
      }
      let doesCallIsSearched = propFilter
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
    let dateToSend;
    if (!callToClose.finished) {
      const newDate = new Date();
      dateToSend = Date.parse(newDate);
    } else {
      dateToSend = callToClose.finished;
    }

    editExistingCall(
      project.key,
      user.uid,
      { ...callToClose, finished: dateToSend, isClosed: true },
      callToClose.id
    );
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

  function handleShowTramites(chamado) {
    router.push({
      pathname: "/calldetails",
      query: {
        key: chamado.key,
      },
    });
  }

  async function handleReopenCall(chamado) {
    let openCall = { ...chamado, isClosed: false };

    await editExistingCall(project.key, user.uid, openCall, chamado.id);
  }

  function handleShowClosedCalls() {
    setClosedCalls(!showClosedCalls);
  }
  // F I L T E R
  function handleChangeDate(e) {
    const { value, name } = e.target;
    setDateInput({ ...dateInput, [name]: value });
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

  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    status: "",
    message: "",
  });

  return [
    project,
    userUid,
    isModalOpen,
    setModal,
    isEditModalOpen,
    setEditModal,
    callToEdit,
    setCallToEdit,
    isDescriptionModalOpen,
    setDescriptionModal,
    description,
    showClosedCalls,
    selectFilter,
    dateInput,
    filteredCalls,
    totalTime,
    personsInProject,
    handleSelectChange,
    handleSearchField,
    handleFilter,
    handleCloseCall,
    checkDescription,
    handleOpenModal,
    handleEditModal,
    handleShowTramites,
    handleReopenCall,
    handleShowClosedCalls,
    handleChangeDate,
    handleDownload,
    openToast,
    setOpenToast,
    toastInfo,
    setToastInfo,
  ];
}
