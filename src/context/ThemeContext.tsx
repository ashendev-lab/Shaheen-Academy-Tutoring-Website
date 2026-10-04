import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isMidnight: boolean;
  toggleMidnight: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isMidnight: false,
  toggleMidnight: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMidnight, setIsMidnight] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('shaheen_midnight');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shaheen_midnight', String(isMidnight));
    } catch {}

    if (isMidnight) {
      document.documentElement.classList.add('midnight');
      document.body.classList.add('midnight');
    } else {
      document.documentElement.classList.remove('midnight');
      document.body.classList.remove('midnight');
    }
  }, [isMidnight]);

  const toggleMidnight = () => {
    setIsMidnight((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isMidnight, toggleMidnight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
