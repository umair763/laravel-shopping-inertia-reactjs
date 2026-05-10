import React from "react";
import ThemeProvider from "./theme.provider.jsx";

export default function AppProvider({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

