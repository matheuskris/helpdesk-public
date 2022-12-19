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
import { getProjects, setProjects } from "../../store/callsSlicer/callsSlicer";
import {
  selectIsProjectsLoading,
  selectUserProjects,
} from "../../store/callsSlicer/calls.selector";
import { transformObjectToArray } from "../../utils/functions.utils";

export function useMenu(user) {
  const dispatch = useDispatch();
  const name = useSelector(selectName);
  const router = useRouter();
  const projects = useSelector(selectUserProjects);
  const isProjectsLoading = useSelector(selectIsProjectsLoading);

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

    // function handleFetch(projectsObject) {
    //   const projectArray = transformObjectToArray(projectsObject);
    //   setProjects(projectArray);
    // }

    function handleInvitesFetch(invitesObject) {
      const invitesArray = transformObjectToArray(invitesObject);
      setInvites(invitesArray);
    }

    InvitesListener(user.uid, handleInvitesFetch);
  }, []);

  useEffect(() => {
    const getProjectsProps = {
      userUid: user.uid,
      callback: (data) => {
        const dataArray = transformObjectToArray(data);
        dispatch(setProjects(dataArray));
      },
    };

    dispatch(getProjects(getProjectsProps));
    console.log("dispatched");
  }, [dispatch, user]);

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

  console.log("carregando:", isProjectsLoading);

  return [
    projects,
    invites,
    isModalOpen,
    setModal,
    logout,
    handleSelect,
    handleAcceptInvite,
    handleCreateProject,
    isProjectsLoading,
  ];
}
