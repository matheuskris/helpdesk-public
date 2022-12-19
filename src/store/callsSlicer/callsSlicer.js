import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { projectsListener } from "../../utils/firebase.utils";
import { transformObjectToArray } from "../../utils/functions.utils";

const initialState = {
  calls: [],
  currentProject: null,
  userProjects: [],
  projectsIsLoading: false,
  error: false,
};

export const getProjects = createAsyncThunk("getProjects", async (props) => {
  const { userUid, callback } = props;
  const projects = await projectsListener(userUid, callback);
  return transformObjectToArray(projects);
});

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    setCalls(state, action) {
      state.calls = action.payload;
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    setProjects(state, action) {
      state.currentProject = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
    [getProjects.pending]: (state) => {
      state.projectsIsLoading = true;
    },
    [getProjects.fulfilled]: (state) => {
      state.projectsIsLoading = false;
    },
    [getProjects.rejected]: (state) => {
      state.projectsIsLoading = false;
      state.error = true;
    },
  },
});

export const { setCalls, setProjects, setCurrentProject } = callsSlice.actions;
export default callsSlice.reducer;
