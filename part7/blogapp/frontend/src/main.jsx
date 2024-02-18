import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationContextProvider } from "./NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </StrictMode>,
);
