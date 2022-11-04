import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

import callsReducer from "./callsSlicer/callsSlicer";
import userReducer from "./userSlicer/userSlicer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userState"],
};

const rootReducer = combineReducers({
  callsState: callsReducer,
  userState: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
