import { RootState } from "../store";

export const selectUser = (state: RootState) => state.userState.user;

export const selectProject = (state: RootState) => state.userState.currentProject;

export const selectToken = (state: RootState) => state.userState.userToken;
