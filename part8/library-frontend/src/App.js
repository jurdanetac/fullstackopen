import { useQuery } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const padding = {
    padding: 5,
  };

  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);

  if (authors.loading || books.loading) {
    return <div>loading...</div>;
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/authors">
          authors
        </Link>
        <Link style={padding} to="/books">
          books
        </Link>
        <Link style={padding} to="/add">
          add book
        </Link>
      </div>

      <div>
        <Routes>
          <Route
            path="/authors"
            element={<Authors authors={authors.data.allAuthors} />}
          />
          <Route
            path="/books"
            element={<Books books={books.data.allBooks} />}
          />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
