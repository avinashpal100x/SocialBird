import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from './postSlice.js'
import chatSlice from './chatSlice.js'





import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage: storage.default || storage,
};





const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
});





const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,],
      },
    }),
});

export default store;