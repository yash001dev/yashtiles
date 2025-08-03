import { configureStore } from "@reduxjs/toolkit";
import frameCustomizerReducer from "./slices/frameCustomizerSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    frameCustomizer: frameCustomizerReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
