import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notificationChange: (state, action) => {
      return action.payload;
    },
    notificationReset: (state, action) => {
      return "";
    },
  },
});

export const { notificationChange, notificationReset } =
  notificationSlice.actions;
export default notificationSlice.reducer;
