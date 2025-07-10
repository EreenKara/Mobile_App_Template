// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './reducers/settings/settingsSlice';
import authReducer from './reducers/auth/authSlice';
import notificationReducer from './reducers/notification/notificationSlice';

export const store = configureStore({
   reducer: {
      settings: settingsReducer,
      auth: authReducer,
      notification: notificationReducer,
   },
});

// Global tip tanımlamaları
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
