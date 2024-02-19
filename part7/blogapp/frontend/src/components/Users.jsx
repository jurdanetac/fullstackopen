import React, { useState, useEffect } from "react";
import userService from "../services/users";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  // fetches users from server
  useEffect(() => {
    userService.getAll().then((users) => setUsers(users));
  }, []);

  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
