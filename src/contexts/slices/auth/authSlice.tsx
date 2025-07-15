// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '@apptypes/entities/user';

interface AuthState {
   accessToken: string | null;
   refreshToken: string | null;
   user: User | null;
   isAuthenticated: boolean;
}

const initialState: AuthState = {
   accessToken: null,
   refreshToken: null,
   user: null,
   isAuthenticated: false,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      loginAction(
         state,
         action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            user: User;
         }>,
      ) {
         state.accessToken = action.payload.accessToken;
         state.refreshToken = action.payload.refreshToken;
         state.user = action.payload.user;
         state.isAuthenticated = true;
      },
      logoutAction(state) {
         state.accessToken = null;
         state.refreshToken = null;
         state.user = null;
         state.isAuthenticated = false;
      },
   },
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;
