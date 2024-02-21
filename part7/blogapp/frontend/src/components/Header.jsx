import { Link } from "react-router-dom";
import Notification from "./Notification";
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";

const Header = ({ user, message, type, handleLogout }) => {
  // if logged in, show user's name and logout button
  if (user) {
    return (
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/">home</Link>
              </Typography>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/blogs">blogs</Link>
              </Typography>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/users">users</Link>
              </Typography>

              <div>
                {user !== null && user.name ? (
                  <>
                    {user.name} logged in{" "}
                    <button onClick={handleLogout}>logout</button>
                  </>
                ) : null}
              </div>
            </Toolbar>
          </AppBar>
        </Box>

        <h2>blog app</h2>
        <Notification message={message} type={type} />
        <br />
      </div>
    );
  }
};
export default Header;
