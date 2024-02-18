import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { NotificationContextProvider } from "./NotificationContext";
import { BlogsContextProvider } from "./BlogsContext";
import { UserContextProvider } from "./UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <NotificationContextProvider>
      <BlogsContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </BlogsContextProvider>
    </NotificationContextProvider>
  </StrictMode>,
);
