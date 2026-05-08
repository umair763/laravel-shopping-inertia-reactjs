import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loading: false,
    toast: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { setLoading, setToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
