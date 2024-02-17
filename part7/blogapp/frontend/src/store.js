import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});

// print store state to console every time it changes for debugging
store.subscribe(() => console.log(store.getState()));

export default store;
