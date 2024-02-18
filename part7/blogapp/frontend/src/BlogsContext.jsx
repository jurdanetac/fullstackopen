import { createContext, useReducer, useContext } from "react";

const blogsReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    default:
      return state;
  }
};

const BlogsContext = createContext();

export const BlogsContextProvider = (props) => {
  const [blog, blogsDispatch] = useReducer(blogsReducer, []);

  return (
    <BlogsContext.Provider value={[blog, blogsDispatch]}>
      {props.children}
    </BlogsContext.Provider>
  );
};

export const useBlogsValue = () => {
  const blogsAndDispatch = useContext(BlogsContext);
  return blogsAndDispatch[0];
};

export const useBlogsDispatch = () => {
  const blogsAndDispatch = useContext(BlogsContext);
  return blogsAndDispatch[1];
};

export default BlogsContext;
