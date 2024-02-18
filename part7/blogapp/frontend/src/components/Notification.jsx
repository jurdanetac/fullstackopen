import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();
  const { message, type } = notification;

  const style = {
    display: message ? "" : "none",
    color: type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <h2 style={style} className={type}>
      {message}
    </h2>
  );
};

export default Notification;
