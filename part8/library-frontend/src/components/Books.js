import { useState } from "react";

const Books = ({ books }) => {
  const [genre, setGenre] = useState("all genres");
  const genres = books
    .flatMap((b) => b.genres)
    .filter((value, index, self) => self.indexOf(value) === index);
  genres.push("all genres");

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
          {books
            .filter((b) => b.genres.includes(genre) || genre === "all genres")
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
