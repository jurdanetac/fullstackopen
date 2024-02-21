import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@mui/material";

const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return <Alert severity={type}>{message}</Alert>;
};

export default Notification;
