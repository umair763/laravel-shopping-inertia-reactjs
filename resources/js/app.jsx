import React from "react";
import { createRoot } from "react-dom/client";
import "../css/app.css";
import AppProvider from "./app/providers/app.provider.jsx";

createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);

