import { useReducer, createContext, useContext, useEffect } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW":
      return `anecdote '${action.data.content}' created`;
    case "VOTE":
      return `anecdote '${action.data.content}' voted`;
    case "CLEAR":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  );

  useEffect(() => {
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, 5000);
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;
