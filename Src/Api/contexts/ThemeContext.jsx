import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode: theme === 'dark', 
      toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light') 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};