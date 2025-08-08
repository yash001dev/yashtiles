import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoginDialogOpen: boolean;
  isAuthModalOpen: boolean;
}

const initialState: UIState = {
  isLoginDialogOpen: false,
  isAuthModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLoginDialog: (state) => {
      state.isLoginDialogOpen = true;
    },
    closeLoginDialog: (state) => {
      state.isLoginDialogOpen = false;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const {
  openLoginDialog,
  closeLoginDialog,
  openAuthModal,
  closeAuthModal,
} = uiSlice.actions;
export default uiSlice.reducer;
