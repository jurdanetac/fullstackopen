import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationContextProvider } from "./NotificationContext";
import { BlogsContextProvider } from "./BlogsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <NotificationContextProvider>
      <BlogsContextProvider>
        <App />
      </BlogsContextProvider>
    </NotificationContextProvider>
  </StrictMode>,
);
