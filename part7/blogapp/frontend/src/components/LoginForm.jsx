import { useState } from "react";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );
};

export default LoginForm;
