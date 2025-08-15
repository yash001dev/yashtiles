import { configureStore } from "@reduxjs/toolkit";
import frameCustomizerReducer from "./slices/frameCustomizerSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { apiSlice } from "./api/apiSlice";
import { resourcesApi } from "./api/resourcesApi";

export const store = configureStore({
  reducer: {
    frameCustomizer: frameCustomizerReducer,
    auth: authReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, resourcesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
