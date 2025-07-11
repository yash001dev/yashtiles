import { configureStore } from '@reduxjs/toolkit';
import frameCustomizerReducer from './slices/frameCustomizerSlice';

export const store = configureStore({
  reducer: {
    frameCustomizer: frameCustomizerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
