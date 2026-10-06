import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null as any,
  isAuthModalOpen: false,
  usersDb: [
    { username: 'admin', password: 'ytasty2026', role: 'admin' }
  ],
  error: null as string | null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openAuthModal: (state) => { state.isAuthModalOpen = true; },
    closeAuthModal: (state) => { state.isAuthModalOpen = false; state.error = null; },
    register: (state, action) => {
      const exists = state.usersDb.find(u => u.username === action.payload.username);
      if (exists) {
        state.error = "Ce compte existe déjà.";
      } else {
        const newUser = { username: action.payload.username, password: action.payload.password, role: 'client' };
        state.usersDb.push(newUser);
        state.user = newUser;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.error = null;
      }
    },
    login: (state, action) => {
      const user = state.usersDb.find(u => u.username === action.payload.username && u.password === action.payload.password);
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.error = null;
      } else {
        state.error = "Identifiants incorrects.";
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { openAuthModal, closeAuthModal, register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;