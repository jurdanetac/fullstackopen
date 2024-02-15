import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

const user = {
  username: "Jest",
};

const blog = {
  title: "Component testing is done with react-testing-library",
  author: "Jest",
  url: "https://react.dev/",
  likes: 5,
  user: user, // forced for testing purposes
};

test("renders correct initial content", () => {
  const { container } = render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={user}
    />,
  );

  // locate the div that contains the blog
  const div = container.querySelector(".blog");
  const togglableDiv = container.querySelector(".togglableContent");

  // check that the togglable content div was not rendered
  expect(togglableDiv).toBe(null);

  // check that title and author are rendered
  expect(div).toHaveTextContent(blog.title);
  expect(div).toHaveTextContent(blog.author);

  // check that url and likes are not rendered
  expect(div).not.toHaveTextContent(blog.url);
  expect(div).not.toHaveTextContent(blog.likes);
});

test("renders correct content after toggling", async () => {
  const { container } = render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      user={user}
    />,
  );

  const testUser = userEvent.setup();
  const button = screen.getByText("view");
  await testUser.click(button);

  // locate the div that contains the blog
  const div = container.querySelector(".blog");
  // null if not visible
  const togglableDiv = container.querySelector(".togglableContent");

  expect(div).toHaveTextContent(blog.title);
  expect(div).toHaveTextContent(blog.author);
  expect(togglableDiv).toHaveTextContent(blog.url);
  expect(togglableDiv).toHaveTextContent(blog.likes);
});

test("clicking the like button twice calls event handler twice", async () => {
  const mockLike = jest.fn();

  const { container } = render(
    <Blog
      blog={blog}
      handleLike={mockLike}
      handleDelete={() => {}}
      user={user}
    />,
  );

  // expand the blog
  const testUser = userEvent.setup();
  const button = screen.getByText("view");
  await testUser.click(button);

  // locate and press twice the like button
  const likeButton = screen.getByText("like");
  await testUser.click(likeButton);
  await testUser.click(likeButton);

  expect(mockLike.mock.calls).toHaveLength(2);
});
