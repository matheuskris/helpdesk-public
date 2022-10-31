import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { callsSlice } from "./callsSlicer/callsSlicer";

const makeStore = () =>
  configureStore({
    reducer: {
      [callsSlice.name]: callsSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);
