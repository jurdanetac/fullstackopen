import { useQuery, gql } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";

const App = () => {
  const padding = {
    padding: 5,
  };

  const ALL_AUTHORS = gql`
    query {
      allAuthors {
        name
        born
        bookCount
      }
    }
  `;

  const ALL_BOOKS = gql`
    query {
      allBooks {
        title
        author
        published
      }
    }
  `;

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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
