import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("renders correct initial content", async () => {
  const mockFormHandler = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={mockFormHandler} />);

  const textboxes = screen.getAllByRole("textbox");

  const blog = {
    title: "testing a form...",
    author: "author of blog",
    url: "https://react.dev/",
  };

  const title = textboxes[0];
  await user.type(title, blog.title);

  const author = textboxes[1];
  await user.type(author, blog.author);

  const url = textboxes[2];
  await user.type(url, blog.url);

  const button = screen.getByText("create");
  await user.click(button);

  expect(mockFormHandler.mock.calls).toHaveLength(1);

  const call = mockFormHandler.mock.calls[0][0];
  expect(call.title).toBe(blog.title);
  expect(call.author).toBe(blog.author);
  expect(call.url).toBe(blog.url);
});
