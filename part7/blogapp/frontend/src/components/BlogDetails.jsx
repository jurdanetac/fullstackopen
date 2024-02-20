import React, { useState, useEffect } from "react";
import { useMatch } from "react-router-dom";
import blogService from "../services/blogs";

const BlogDetails = ({ handleLike }) => {
  const [blogInUrl, setBlogInUrl] = useState(null);
  const [comment, setComment] = useState("");

  // if user is detected on url, fetch user from server
  const match = useMatch("/blogs/:id");
  // fetches users from server at component mount
  useEffect(() => {
    if (match) {
      blogService.getAll().then((blogs) => {
        const blog = blogs.find((blog) => blog.id === match.params.id);
        setBlogInUrl(blog);
      });
    }
  }, []);

  if (!blogInUrl) {
    return null;
  }

  const likeBlog = async (blog) => {
    handleLike(blog);
    setBlogInUrl({ ...blog, likes: blog.likes + 1 });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await blogService.comment(blogInUrl.id, comment);
    setBlogInUrl({
      ...blogInUrl,
      comments: blogInUrl.comments.concat(comment),
    });
    setComment("");
  };

  return (
    <div>
      <h2>{blogInUrl.title}</h2>
      <a href={blogInUrl.url}>{blogInUrl.url}</a>
      <p>
        {blogInUrl.likes} likes{" "}
        <button onClick={() => likeBlog(blogInUrl)}>like</button>
      </p>
      <p>added by {blogInUrl.user.name}</p>
      <h3>comments</h3>
      <form>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="comment"
          type="text"
          placeholder="lol"
        />
        <button type="submit" onClick={(e) => handleComment(e)}>
          add comment
        </button>
      </form>
      <ul>
        {blogInUrl.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetails;
