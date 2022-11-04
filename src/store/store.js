import { combineReducers, configureStore } from "@reduxjs/toolkit";
import callsReducer from "./callsSlicer/callsSlicer";
import userReducer from "./userSlicer/userSlicer";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

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
});

export const persistor = persistStore(store);
