import { configureStore } from "@reduxjs/toolkit";
import posCartReducer from "@/store/posCartSlice";
import kioskCartReducer from "@/store/kioskCartSlice";
import logger from 'redux-logger'

const middleWares = [!import.meta.env.PROD && logger].filter(Boolean)

export const store = configureStore({
  reducer: {
    posCart: posCartReducer,
    kioskCart: kioskCartReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(middleWares)
});
