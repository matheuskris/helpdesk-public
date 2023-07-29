import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Project } from "../../models/Project";

interface User {
  id: number;
  name: string;
  email: string;
  projects: Project[];
}

interface UserState {
  user: User | null;
  currentProject: Project | null;
  userToken: string;
}


const initialState: UserState = {
  user: null,
  currentProject: null,
  userToken: "",
};

export const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setCurrentProject(state, action: PayloadAction<Project | null>) {
      state.currentProject = action.payload;
    },
    setUserToken(state, action: PayloadAction<string>) {
      state.userToken = action.payload;
    },
    handleLogin(state, action) {
      const { userToken } = action.payload;
      state.userToken = userToken;
    }
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.auth,
  //     };
  //   },
  },
});

export const { setUser, setCurrentProject, setUserToken } = userSlice.actions;

export default userSlice.reducer;
