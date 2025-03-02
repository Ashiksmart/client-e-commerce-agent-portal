import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  severity: null,
  summary: "",
  detail: "",
  life: 3000,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      const { severity, summary, detail, life } = action.payload;
      state.severity = severity;
      state.summary = summary;
      state.detail = detail;
      state.life = life;
    },
    hideToast: (state) => {
      state = initialState
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
