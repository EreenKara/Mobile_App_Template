import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import Colors, {ColorsSchema} from '@styles/common/colors';

interface ThemeContextType {
  colors: ColorsSchema;
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: Colors.getTheme(),
  colorScheme: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setColorScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const themeColors = useMemo(() => {
    return {
      colors: Colors.getTheme(colorScheme),
      colorScheme,
      toggleTheme,
    };
  }, [colorScheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeColors}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColors = () => useContext(ThemeContext);
