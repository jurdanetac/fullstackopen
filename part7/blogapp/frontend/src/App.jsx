import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import blogService from "./services/blogs";
import loginService from "./services/login";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import {
  notificationChange,
  notificationReset,
} from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // store
  const dispatch = useDispatch();
  // notification
  const message = useSelector((state) => state.notification.message);
  const type = useSelector((state) => state.notification.type);

  // creates a reference to the blog form
  const blogFormRef = useRef();

  // fetches blogs from server
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // checks if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // performs login and saves session to browser
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");

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
        const updatedBlogs = [...blogs];
        updatedBlogs[blogs.indexOf(blog)].likes += 1;
        setBlogs(updatedBlogs);
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
          const updatedBlogs = [...blogs];
          updatedBlogs.splice(blogs.indexOf(blog), 1);
          setBlogs(updatedBlogs);

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

      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
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
        setBlogs(blogs.concat(createdBlog));
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
      <h2>blogs</h2>

      <Notification message={message} type={type} />

      {user.name ? (
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      ) : null}

      <Togglable
        btnId="add-blog-button"
        buttonLabel="create new blog"
        ref={blogFormRef}
      >
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div className="blogs">
        {blogs
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
              className="blog"
            />
          ))
          .sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
      </div>
    </div>
  );

  return <>{user === null ? loginForm() : blogForm()}</>;
};

export default App;
