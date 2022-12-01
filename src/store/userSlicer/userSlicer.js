import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: null,
  currentProject: null,
  name: "",
};

export const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setCurrentProject(state, action) {
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
  },
});

export const { setUser, setCurrentProject, setName } = userSlice.actions;

export default userSlice.reducer;
