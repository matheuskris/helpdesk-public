export const selectAllCalls = (state) => state.callsState.calls;
export const selectUserProjects = (state) => state.callsState.userProjects;
export const selectIsProjectsLoading = (state) =>
  state.callsState.projectsIsLoading;
