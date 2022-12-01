import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import {
  editExistingTramite,
  proceduresListener,
} from "../../utils/firebase.utils";
import { useSelector } from "react-redux";
import {
  selectProject,
  selectUser,
} from "../../store/userSlicer/user.selector";

export function useCallDetails() {
  const router = useRouter();
  const callKey = router.query.key;

  const project = useSelector(selectProject);
  const user = useSelector(selectUser);

  const [isCreateTramiteModalOpen, setCreateTramiteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tramiteToEdit, setTramiteToEdit] = useState({});

  const [proceduresCall, setProceduresCall] = useState({});
  const personsInProject = Object.values(project.users);

  const tramites = transformObjectToArray(proceduresCall?.tramites);
  tramites.reverse();

  function openTramiteModal() {
    setCreateTramiteModal(true);
  }

  function handleEditTramite(tramite) {
    setIsEditModalOpen(true);
    setTramiteToEdit(tramite);
  }

  function transformObjectToArray(object) {
    const newArray = [];
    for (const prop in object) {
      newArray.push(object[prop]);
    }
    return newArray;
  }

  useEffect(() => {
    function setUseStateCall(newCall) {
      setProceduresCall(newCall);
    }
    proceduresListener(setUseStateCall, project.key, callKey);
  }, [callKey]);

  async function handleCloseTramite(tramite) {
    const newDate = new Date();
    const sendDate = Date.parse(newDate);

    const objectToSend = {
      ...tramite,
      finished: sendDate,
    };

    const response = await editExistingTramite(
      project.key,
      user.uid,
      callKey,
      objectToSend
    );
    console.log(response);
  }

  function goToCalls() {
    router.push({
      pathname: "/helpdesk",
    });
  }
  return [
    isCreateTramiteModalOpen,
    setCreateTramiteModal,
    isEditModalOpen,
    setIsEditModalOpen,
    tramiteToEdit,
    setTramiteToEdit,
    proceduresCall,
    personsInProject,
    openTramiteModal,
    handleEditTramite,
    handleCloseTramite,
    goToCalls,
    tramites,
  ];
}
