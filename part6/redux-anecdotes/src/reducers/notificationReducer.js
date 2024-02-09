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

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(notificationChange(message));

    setTimeout(() => {
      dispatch(notificationReset());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;
