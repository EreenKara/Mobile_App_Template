// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@apptypes/entities/userProfile';

interface AuthState {
   accessToken: string | null;
   refreshToken: string | null;
   user: UserProfile | null;
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
            user: UserProfile;
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
