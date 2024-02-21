import { useState } from "react";

import { Button } from "@mui/material";
import { TextField } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  // blog form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:{" "}
        <TextField
          size="small"
          id="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          required
        />
      </div>
      <div>
        author:{" "}
        <TextField
          size="small"
          id="author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          required
        />
      </div>
      <div>
        url:{" "}
        <TextField
          size="small"
          id="url"
          type="url"
          value={url}
          name="URL"
          onChange={({ target }) => setUrl(target.value)}
          required
        />
      </div>
      <Button
        id="create-blog-button"
        type="submit"
        variant="contained"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        create
      </Button>
    </form>
  );
};

export default BlogForm;
