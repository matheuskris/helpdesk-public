import { RootState } from "../store";

export const selectAllCalls = (state: RootState) => state.callsState.calls;
export const selectIsProjectsLoading = (state: RootState) =>
  state.callsState.projectsIsLoading;
export const selectCallsError = (state: RootState) => state.callsState.error;
