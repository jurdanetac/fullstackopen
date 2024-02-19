import { Link } from "react-router-dom";
import Notification from "./Notification";

const Header = ({ user, message, type, handleLogout }) => {
  // if logged in, show user's name and logout button
  if (user) {
    const padding = {
      padding: 5,
    };

    const background = {
      backgroundColor: "grey",
      padding: 5,
    };

    return (
      <div>
        <div style={background}>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/blogs">
            blogs
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
          {user !== null && user.name ? (
            <>
              {user.name} logged in{" "}
              <button onClick={handleLogout}>logout</button>
            </>
          ) : null}
        </div>

        <h2>blog app</h2>
        <Notification message={message} type={type} />
      </div>
    );
  }
};
export default Header;
