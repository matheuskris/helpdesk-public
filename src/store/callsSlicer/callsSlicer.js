import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  calls: null,
};

export const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    setCalls(state, action) {
      state.calls = action.payload;
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

export const { setCalls } = callsSlice.actions;
