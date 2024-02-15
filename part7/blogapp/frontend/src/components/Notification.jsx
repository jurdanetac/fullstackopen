const Notification = ({ message, type }) => {
  const style = {
    display: message === null ? "none" : "",
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
