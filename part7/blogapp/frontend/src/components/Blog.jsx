import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}{" "}
        <button id="expandBlogBtn" onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible ? (
        <div className="togglableContent">
          <div>{blog.url}</div>
          <div id="likes">
            likes {blog.likes}{" "}
            <button id="likeBlogBtn" onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>{blog.author}</div>

          {blog.user.username === user.username ? (
            <button id="deleteBlogBtn" onClick={() => handleDelete(blog)}>
              remove
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Blog;
