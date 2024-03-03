import { useQuery, useApolloClient } from "@apollo/client";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const padding = {
    padding: 5,
  };

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);

  if (authors.loading || books.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/authors">
          authors
        </Link>
        <Link style={padding} to="/books">
          books
        </Link>
        {token ? (
          <>
            <Link style={padding} to="/add">
              add book
            </Link>
            <Link style={padding} onClick={logout}>
              logout
            </Link>
          </>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>

      <div>
        <Routes>
          <Route path="/" element={<></>} />
          <Route
            path="/authors"
            element={<Authors authors={authors.data.allAuthors} />}
          />
          <Route
            path="/books"
            element={<Books books={books.data.allBooks} />}
          />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
