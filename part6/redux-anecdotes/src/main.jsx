import ReactDOM from "react-dom/client";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "./App";
import reducer from "./reducers/anecdoteReducer";

const store = createStore(reducer);

// print store every time it changes
store.subscribe(() => {
  const storeNow = store.getState();
  console.log(storeNow);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
