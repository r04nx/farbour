import { createContext, useContext } from 'react';
import { Theme } from '@/constants/Theme';

interface ThemeContextType {
  colors: typeof Theme.colors;
  shadows: typeof Theme.shadows;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = {
    colors: Theme.colors,
    shadows: Theme.shadows,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 