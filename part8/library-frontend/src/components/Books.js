import { useState } from "react";

const Books = ({ books }) => {
  const [genre, setGenre] = useState("all genres");

  // dissecting unique genres from books
  const genres = books.data.allBooks.map((b) => b.genres).flat();
  // used to show buttons for all genres
  const uniqueGenres = [...new Set(genres), "all genres"];

  // books to show
  const booksToShow = books.data.allBooks.filter((b) =>
    genre === "all genres" ? true : b.genres.includes(genre),
  );

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
          {booksToShow.map((book) => (
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
