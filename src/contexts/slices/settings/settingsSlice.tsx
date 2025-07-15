import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { colorScheme } from 'nativewind';

interface SettingsState {
   darkMode: boolean;
   language: string;
}

const initialState: SettingsState = {
   darkMode: false,
   language: 'tr',
};

const settingsSlice = createSlice({
   name: 'settings',
   initialState,
   reducers: {
      toggleDarkMode(state) {
         state.darkMode = !state.darkMode;
         // 🎯 Direkt NativeWind'i manipüle et
         colorScheme.set(state.darkMode ? 'dark' : 'light');
      },
      setDarkMode(state, action: PayloadAction<boolean>) {
         state.darkMode = action.payload;
         // 🎯 NativeWind'i sync'le
         colorScheme.set(state.darkMode ? 'dark' : 'light');
      },
      setLanguage(state, action: PayloadAction<string>) {
         state.language = action.payload;
      },
      // 🆕 Initialize theme - App başlangıcında kullanmak için
      initializeTheme(state) {
         colorScheme.set(state.darkMode ? 'dark' : 'light');
      },
   },
});

export const { toggleDarkMode, setDarkMode, setLanguage, initializeTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
