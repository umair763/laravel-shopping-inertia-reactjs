import React, { createContext, useMemo, useState } from "react";

export const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
