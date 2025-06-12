import { createAction, createReducer } from '@reduxjs/toolkit';

// Actions
export const loginRequest = createAction('auth/loginRequest');
export const loginSuccess = createAction('auth/loginSuccess');
export const logout = createAction('auth/logout');
export const autoLogin = createAction('auth/autoLogin');

// Initial State
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Reducer
const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginSuccess, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(logout, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    })
    .addCase(autoLogin, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
});

export default authReducer;
