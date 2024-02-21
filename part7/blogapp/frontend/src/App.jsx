// libraries
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, Navigate, useMatch } from "react-router-dom";

// services
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";

// components
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import User from "./components/User";
import BlogDetails from "./components/BlogDetails";

// reducers
import {
  notificationChange,
  notificationReset,
} from "./reducers/notificationReducer";
import { setBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";

// styles
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const App = () => {
  // store (Redux)
  const dispatch = useDispatch();
  const message = useSelector((state) => state.notification.message);
  const type = useSelector((state) => state.notification.type);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  // creates a reference to the blog form
  const blogFormRef = useRef();

  // fetches blogs from server
  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  // checks if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  // performs login and saves session to browser
  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.Username.value;
    const password = event.target.Password.value;
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch(setUser(user));

      console.log(`logged in successfully as ${user.username}`);
    } catch (exception) {
      dispatch(
        notificationChange({
          type: "error",
          message: "Wrong username or password",
        }),
      );
      setTimeout(() => {
        dispatch(notificationReset());
      }, 5000);
    }
  };

  // performs logout and removes session from browser
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    window.location.reload();
    console.log("logged out successfully");
  };

  // increases the likes of a blog by one
  const handleLike = (blog) => {
    console.log("blog", blog);

    const updatedBlog = {
      author: blog.author,
      likes: blog.likes + 1,
      title: blog.title,
      url: blog.url,
      user: blog.user.id,
    };

    console.log("updatedBlog", updatedBlog);

    try {
      blogService.update(blog.id, updatedBlog).then(() => {
        console.log("blog updated successfully");

        // set the id to the updated blog
        updatedBlog.id = blog.id;
        // repopulate the user field
        updatedBlog.user = blog.user;

        // update the blogs state preserving the order
        const updatedBlogs = blogs.map((blog) =>
          blog.id !== updatedBlog.id ? blog : updatedBlog,
        );

        dispatch(setBlogs(updatedBlogs));
      });
    } catch (exception) {
      console.log("exception", exception);
    }
  };

  const handleDelete = (blog) => {
    console.log("blog", blog);

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          console.log("blog deleted successfully");

          // update the blogs state preserving the order
          const updatedBlogs = blogs.filter((b) => b.id !== blog.id);

          // update the blogs in the store
          dispatch(setBlogs(updatedBlogs));

          // show success to user
          dispatch(
            notificationChange({
              type: "success",
              message: `blog ${blog.title} by ${blog.author} deleted`,
            }),
          );
          setTimeout(() => {
            dispatch(notificationReset());
          }, 5000);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      console.log("blog deletion aborted");
    }
  };

  // generates a login form for the user
  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} type={type} />
      <br />
      <LoginForm handleLogin={handleLogin} />
    </div>
  );

  // handles adding a blog
  const addBlog = (blog) => {
    // hide form
    blogFormRef.current.toggleVisibility();

    // logic for blog creation
    try {
      blogService.create(blog).then((createdBlog) => {
        console.log("created blog:", createdBlog);
        // repopulate the user field
        createdBlog.user = user;
        dispatch(setBlogs(blogs.concat(createdBlog)));
        console.log("blog created successfully");

        // show success to user
        dispatch(
          notificationChange({
            type: "success",
            message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
          }),
        );
        setTimeout(() => {
          dispatch(notificationReset());
        }, 5000);
      });
    } catch (exception) {
      console.log("exception", exception);
    }
  };

  // generates a form page to add a blog for the user
  const blogForm = () => (
    <div>
      <Togglable
        btnId="add-blog-button"
        buttonLabel="create new blog"
        ref={blogFormRef}
      >
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs
              .map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell align="left">
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell align="right">{blog.author}</TableCell>
                </TableRow>
              ))
              .sort((a, b) => b.likes - a.likes)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <Container>
      <div>
        <Header
          user={user}
          message={message}
          type={type}
          handleLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={user ? blogForm() : <Navigate replace to="/login" />}
          />
          <Route path="/users" element={user ? <Users /> : loginForm()} />
          <Route path="/users/:id" element={user ? <User /> : loginForm()} />
          <Route
            path="/blogs"
            element={
              user ? (
                <Navigate replace to="/" />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/blogs/:id"
            element={
              user ? <BlogDetails handleLike={handleLike} /> : loginForm()
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : loginForm()}
          />
        </Routes>
      </div>
    </Container>
  );
};

export default App;
