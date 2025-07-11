// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@apptypes/entities/user';

interface AuthState {
   token: string | null;
   user: User | null;
   isAuthenticated: boolean;
}

const initialState: AuthState = {
   token: null,
   user: null,
   isAuthenticated: false,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      login(state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) {
         state.token = action.payload.token;
         state.user = action.payload.user;
         state.isAuthenticated = true;
      },
      logout(state) {
         state.token = null;
         state.user = null;
         state.isAuthenticated = false;
      },
      setToken(state, action: PayloadAction<string>) {
         state.token = action.payload;
      },
      setUser(state, action: PayloadAction<AuthState['user']>) {
         state.user = action.payload;
      },
   },
});

export const { login, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
