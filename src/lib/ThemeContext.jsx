import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('bioortesis_theme');
    return stored === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('bioortesis_theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#020617' : '#F5F3EF';
  }, [isDark]);

  // Apply on first render
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#020617' : '#F5F3EF';
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
