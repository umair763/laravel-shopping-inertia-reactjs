import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice.js";
import cartReducer from "./slices/cart.slice.js";
import uiReducer from "./slices/ui.slice.js";

export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  ui: uiReducer,
});
