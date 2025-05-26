import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthModalMode = 'login' | 'register' | 'closed';

interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
  loading: boolean;
}

const initialState: AuthModalState = {
  isOpen: false,
  mode: 'login',
  loading: false,
};

export const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isOpen = true;
      state.mode = 'login';
    },
    openRegisterModal: (state) => {
      state.isOpen = true;
      state.mode = 'register';
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
      state.mode = 'closed';
    },
    switchToLogin: (state) => {
      state.mode = 'login';
    },
    switchToRegister: (state) => {
      state.mode = 'register';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  openLoginModal,
  openRegisterModal,
  closeAuthModal,
  switchToLogin,
  switchToRegister,
  setLoading,
} = authModalSlice.actions;

export default authModalSlice.reducer;
