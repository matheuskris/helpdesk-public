import { configureStore } from "@reduxjs/toolkit";
import callsReducer from "./callsSlicer/callsSlicer";

export const store = configureStore({
  reducer: {
    callsState: callsReducer,
  },
  devTools: true,
});
