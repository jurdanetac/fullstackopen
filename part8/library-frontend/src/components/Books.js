import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const [genre, setGenre] = useState("all genres");

  // query for all genres, hardcoded "all genres" to show all genres
  const genreQuery = useQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
    variables: { genre: "all genres" },
  });
  // query for books of selected genre
  const bookQuery = useQuery(ALL_BOOKS, {
    fetchPolicy: "network-only",
    variables: { genre: genre },
  });

  // genres loading
  if (genreQuery.loading) {
    return <div>loading...</div>;
  }

  // dissecting unique genres from books
  const genres = genreQuery.data.allBooks.map((b) => b.genres).flat();
  // used to show buttons for all genres
  const uniqueGenres = [...new Set(genres), "all genres"];

  // books loading
  if (bookQuery.loading) {
    return <div>loading...</div>;
  }

  // books to show
  const books = bookQuery.data.allBooks.map((b) => b);

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <b>{genre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
