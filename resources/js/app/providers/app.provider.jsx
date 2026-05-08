import React from "react";
import StoreProvider from "./store.provider.jsx";
import QueryProvider from "./query.provider.jsx";
import ThemeProvider from "./theme.provider.jsx";
import AppRouterProvider from "./router.provider.jsx";

export default function AppProvider() {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider>
          <AppRouterProvider />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}

