// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settings/settingsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/auth/authSlice';
import notificationReducer from './slices/notification/notificationSlice';
import locationReducer from './slices/locationSlice/locationSlice'; // locationReducer'ı import edin
// Redux Persist configuration
const persistConfig = {
   key: 'root',
   storage: AsyncStorage,
   whitelist: ['settings'], // Sadece settings'i persist et
};
const persistedReducer = persistReducer(persistConfig, settingsReducer);

export const store = configureStore({
   reducer: {
      settings: persistedReducer,
      auth: authReducer,
      notification: notificationReducer,
      location: locationReducer, // locationReducer'ı ekleyin
   },
   middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
         },
      }),
});

// Global tip tanımlamaları
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
