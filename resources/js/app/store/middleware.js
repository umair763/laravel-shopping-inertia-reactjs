import { Tuple } from "@reduxjs/toolkit";

const middleware = (getDefaultMiddleware) =>
  new Tuple(...getDefaultMiddleware({ serializableCheck: false }));

export default middleware;
