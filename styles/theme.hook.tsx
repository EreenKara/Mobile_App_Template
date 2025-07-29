// hooks/useTheme.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { colorScheme } from 'nativewind';
import { RootState } from '@contexts/store';

export const useTheme = () => {
   const darkMode = useSelector((state: RootState) => state.settings.darkMode);

   useEffect(() => {
      colorScheme.set(darkMode);
   }, [darkMode]);

   return darkMode;
};
