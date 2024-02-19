import Notification from "./Notification";

const Header = ({ user, message, type, handleLogout }) => {
  // if logged in, show user's name and logout button
  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} type={type} />

        {user !== null && user.name ? (
          <p>
            {user.name} logged in <br />{" "}
            <button onClick={handleLogout}>logout</button>
          </p>
        ) : null}
      </div>
    );
  }
};
export default Header;
