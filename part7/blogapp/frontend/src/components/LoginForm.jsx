import { useState } from "react";
import { TextField, Button } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <br />
        <TextField
          variant="standard"
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
        <br />
        <TextField
          variant="standard"
          type="password"
          value={password}
          name="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <br />
      <Button type="submit" id="login-button" variant="contained">
        login
      </Button>
    </form>
  );
};

export default LoginForm;
