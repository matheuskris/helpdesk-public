import { configureStore } from "@reduxjs/toolkit";
import { callsSlice } from "./callsSlicer/callsSlicer";

export const store = configureStore({
  reducer: {
    [callsSlice.name]: callsSlice.reducer,
  },
  devTools: true,
});
