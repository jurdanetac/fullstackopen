const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontStyle: "italic",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={notificationStyle}>
      <em>{message}</em>
    </div>
  );
};

export default Notification;
