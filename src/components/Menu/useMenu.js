import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  projectsListener,
  InvitesListener,
  getProjectInfo,
} from "../../utils/firebase.utils";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { selectName } from "../../store/userSlicer/user.selector";
import {
  setUser,
  setCurrentProject,
  setName,
} from "../../store/userSlicer/userSlicer";

export function useMenu(user) {
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [invites, setInvites] = useState([]);
  const [isModalOpen, setModal] = useState(false);

  useEffect(() => {
    function transformObjectToArray(object) {
      const newArray = [];
      for (const prop in object) {
        newArray.push(object[prop]);
      }
      return newArray;
    }

    function handleFetch(projectsObject) {
      const projectArray = transformObjectToArray(projectsObject);
      setProjects(projectArray);
    }

    function handleInvitesFetch(invitesObject) {
      const invitesArray = transformObjectToArray(invitesObject);
      setInvites(invitesArray);
    }

    projectsListener(user.uid, handleFetch);
    InvitesListener(user.uid, handleInvitesFetch);
  }, []);

  function logout() {
    dispatch(setUser(null));
    dispatch(setName(null));
  }

  async function handleSelect(project) {
    const projectinfo = await getProjectInfo(project.key);

    dispatch(setCurrentProject(projectinfo));
    router.push("/helpdesk");
  }

  async function handleAcceptInvite(projectUid) {
    const response = await axios.post("/api/hello", {
      method: "POST",
      body: {
        type: "acceptInvite",
        projectUid,
        name,
        uid: user.uid,
      },
    });
    console.log(response);
  }

  function handleCreateProject() {
    setModal(true);
  }
  return [
    projects,
    invites,
    isModalOpen,
    setModal,
    logout,
    handleSelect,
    handleAcceptInvite,
    handleCreateProject,
  ];
}
