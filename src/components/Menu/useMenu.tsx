import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  setCurrentProject,
  setUserToken,
} from "../../store/userSlicer/userSlicer";
import { getCalls } from "../../store/callsSlicer/callsSlicer";
import {
  selectIsProjectsLoading,
} from "../../store/callsSlicer/calls.selector";
import { selectUser } from "../../store/userSlicer/user.selector";
import { AppDispatch } from "../../store/store";

export function useMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const router = useRouter();
  const projects = user?.projects;
  const isProjectsLoading = useSelector(selectIsProjectsLoading);

  const [invites, setInvites] = useState([]);
  const [isModalOpen, setModal] = useState(false);

  function logout() {
    dispatch(setUser(null));
    dispatch(setUserToken(""));
  }

  async function handleSelect(projectId: number) {
    dispatch(getCalls(projectId));
    router.push("/helpdesk");
  }

  // async function handleAcceptInvite(projectUid) {
  //   const response = await axios.post("/api/hello", {
  //     method: "POST",
  //     body: {
  //       type: "acceptInvite",
  //       projectUid,
  //       name,
  //       uid: user.uid,
  //     },
  //   });
  //   console.log(response);
  // }

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
    // handleAcceptInvite,
    handleCreateProject,
    isProjectsLoading,
  ] as const;
}
