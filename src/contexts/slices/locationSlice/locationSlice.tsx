// store/slices/locationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import City from '@apptypes/entities/city'; // Entity tiplerinizi buraya import edin
import District from '@apptypes/entities/district'; // Entity tiplerinizi buraya import edin

interface LocationState {
   cities: City[];
   districts: District[];
   selectedCity: City | null;
   selectedDistrict: District | null;
   loading: boolean;
   error: string | null;
}

const initialState: LocationState = {
   cities: [],
   districts: [],
   selectedCity: null,
   selectedDistrict: null,
   loading: false,
   error: null,
};

const locationSlice = createSlice({
   name: 'location',
   initialState,
   reducers: {
      // Cities actions
      setCities: (state, action: PayloadAction<City[]>) => {
         state.cities = action.payload;
         state.error = null;
      },

      // Districts actions
      setDistricts: (state, action: PayloadAction<District[]>) => {
         state.districts = action.payload;
         state.error = null;
      },

      clearDistricts: state => {
         state.districts = [];
      },

      // Selection actions
      setSelectedCity: (state, action: PayloadAction<City | null>) => {
         state.selectedCity = action.payload;
         if (!action.payload) {
            state.selectedDistrict = null;
         }
      },

      setSelectedDistrict: (state, action: PayloadAction<District | null>) => {
         state.selectedDistrict = action.payload;
      },

      // Loading actions
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
      },

      // Error actions
      setError: (state, action: PayloadAction<string | null>) => {
         state.error = action.payload;
      },

      // Clear all data
      clearAllLocationData: state => {
         state.cities = [];
         state.districts = [];
         state.selectedCity = null;
         state.selectedDistrict = null;
         state.error = null;
      },

      // Bulk update için
      updateLocationState: (state, action: PayloadAction<Partial<LocationState>>) => {
         Object.assign(state, action.payload);
      },
   },
});

export const {
   setCities,
   setDistricts,
   clearDistricts,
   setSelectedCity,
   setSelectedDistrict,
   setLoading,
   setError,
   clearAllLocationData,
   updateLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
