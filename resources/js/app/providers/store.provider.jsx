import React from "react";
import { Provider } from "react-redux";
import store from "../store/index.js";

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
