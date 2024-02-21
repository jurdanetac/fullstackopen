import React, { useState, useEffect } from "react";
import userService from "../services/users";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);

  // fetches users from server
  useEffect(() => {
    userService.getAll().then((users) => setUsers(users));
  }, []);

  return (
    <div>
      <h2>Users</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {users
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="left">
                    <Link to={`/users/${user.id}`}>
                      {user.name ? user.name : user.username}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{user.blogs.length}</TableCell>
                </TableRow>
              ))
              .sort((a, b) => b.likes - a.likes)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
