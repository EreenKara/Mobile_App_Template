import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
   darkMode: 'dark' | 'light';
   language: string;
}

const initialState: SettingsState = {
   darkMode: 'light',
   language: 'tr',
};

const settingsSlice = createSlice({
   name: 'settings',
   initialState,
   reducers: {
      toggleDarkMode(state) {
         state.darkMode = state.darkMode === 'dark' ? 'light' : 'dark';
         // ❌ Burada colorScheme.set() çağırma
      },
      setDarkMode(state, action: PayloadAction<'dark' | 'light'>) {
         state.darkMode = action.payload;
         // ❌ Burada colorScheme.set() çağırma
      },
      setLanguage(state, action: PayloadAction<string>) {
         state.language = action.payload;
      },
   },
});

export const { toggleDarkMode, setDarkMode, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
