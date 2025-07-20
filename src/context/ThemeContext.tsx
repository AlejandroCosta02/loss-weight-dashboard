import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: theme === 'light' ? '#ffffff' : '#1a1a1a',
    surface: theme === 'light' ? '#f8fafc' : '#2a2a2a',
    text: theme === 'light' ? '#1e293b' : '#f1f5f9',
    textSecondary: theme === 'light' ? '#64748b' : '#94a3b8',
    border: theme === 'light' ? '#e2e8f0' : '#374151',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}; 