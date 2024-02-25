import Select from "react-select";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries";

const Authors = ({ authors }) => {
  const [author, setAuthor] = useState("");
  const [birthyear, setBirthyear] = useState("");

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (event) => {
    // prevent refresh
    event.preventDefault();
    // change the author's birthyear
    updateAuthor({
      variables: {
        name: author.value,
        setBornTo: parseInt(birthyear),
      },
    });
    // clear the input fields
    setAuthor("");
    setBirthyear("");
  };

  const AuthorsList = () => {
    const options = authors.map((a) => {
      return {
        value: a.name,
        label: a.name,
      };
    });

    return (
      <Select
        options={options}
        value={author}
        onChange={(choice) => setAuthor(choice)}
      />
    );
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <AuthorsList />
        <div>
          birthyear
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
