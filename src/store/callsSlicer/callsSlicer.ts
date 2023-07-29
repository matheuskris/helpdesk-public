import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { projectsListener } from "../../utils/firebase.utils";
import { transformObjectToArray } from "../../utils/functions.utils";
import { Call } from "../../models/Callt";
import projectApi from "../../api/projectApi";

interface CallsState {
  calls: Call[];
  projectsIsLoading: boolean;
  error: boolean;
}

const initialState: CallsState  = {
  calls: [],
  projectsIsLoading: false,
  error: false,
};

export const getCalls = createAsyncThunk("getProjects", async (projectId: number) => {
  const result = await projectApi.getCalls(projectId);
  return result.data;
});

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    setCalls(state, action) {
      state.calls = action.payload;
    },
  },
  extraReducers:
    // [HYDRATE]: (state, action) => {
    //   return {
    //     ...state,
    //     ...action.payload.auth,
    //   };
    // },
    (builder) => {
      builder.addCase(getCalls.pending, (state) => {
      state.projectsIsLoading = true;
    }),
    builder.addCase(getCalls.fulfilled, (state, {payload}) => {
      state.projectsIsLoading = false;
      state.calls = payload.data;
    }),
    builder.addCase(getCalls.rejected, (state) => {
      state.projectsIsLoading = false;
      state.error = true;
    })
  }
});

export const { setCalls } = callsSlice.actions;
export default callsSlice.reducer;
