const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        type="text"
        value={username}
        name="Username"
        id="username"
        onChange={({ target }) => setUsername(target.value)}
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
        onChange={({ target }) => setPassword(target.value)}
        required
      />
    </div>
    <button type="submit" id="login-button">
      login
    </button>
  </form>
);

export default LoginForm;
