import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root.reducer.js";
import middleware from "./middleware.js";

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export default store;

