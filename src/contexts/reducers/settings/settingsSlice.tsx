// src/features/settings/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      },
      setLanguage(state, action: PayloadAction<string>) {
         state.language = action.payload;
      },
   },
});

export const { toggleDarkMode, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
