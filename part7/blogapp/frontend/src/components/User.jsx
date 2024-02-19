import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import userService from "../services/users";

const User = () => {
  const [userInUrl, setUserInUrl] = useState(null);

  // if user is detected on url, fetch user from server
  const match = useMatch("/users/:id");
  // fetches users from server at component mount
  useEffect(() => {
    if (match) {
      userService.getAll().then((users) => {
        const user = users.find((user) => user.id === match.params.id);
        setUserInUrl(user);
      });
    }
  }, []);

  if (!userInUrl) {
    return null;
  }

  return (
    <div>
      <h2>{userInUrl.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {userInUrl.blogs.map((blog) => (
          <li key={blog.title}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default User;
