import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../Features/authSlice.js";
import adminReducer from "../Features/adminSlice.js";

// persist config
const persistConfig = {
  key: "root",       
  storage,          
};


const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
});

// persisted reducer 
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store 
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
