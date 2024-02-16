import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { type: "", message: "" },
  reducers: {
    notificationChange: (state, action) => {
      return { type: action.payload.type, message: action.payload.message };
    },
    notificationReset: (state, action) => {
      return { type: "", message: "" };
    },
  },
});

export const { notificationChange, notificationReset } =
  notificationSlice.actions;
export default notificationSlice.reducer;
