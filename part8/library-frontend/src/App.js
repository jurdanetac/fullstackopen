import { useApolloClient, useQuery, useSubscription } from "@apollo/client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from "./queries";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    setToken(token);
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title}`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  const padding = {
    padding: 5,
  };

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const user = useQuery(ME);

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
            <Link style={padding} to="/recommend">
              recommend
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
          <Route path="/books" element={<Books books={books} />} />
          <Route path="/login" element={<LoginForm setToken={setToken} />} />
          <Route
            path="/add"
            element={token ? <NewBook /> : <Navigate to="/login" />}
          />
          <Route
            path="/recommend"
            element={
              token ? (
                <Recommend user={user} books={books.data.allBooks} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
