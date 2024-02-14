import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
    reset: () => setValue(""),
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  // get resources from server
  const getAll = () => {
    return axios.get(baseUrl).then((response) => {
      return response.data;
    });
  };

  // populate resource list on render
  useEffect(() => {
    getAll().then((res) => {
      setResources(res);
    });
  }, []);

  const create = async (resource) => {
    // post new resource to server
    const response = await axios.post(baseUrl, resource);
    // fetch again since we have a new resource with a server generated id
    setResources(await getAll());
    return response.data;
  };

  const service = {
    create,
    getAll,
  };

  return [resources, service];
};

const App = () => {
  const { reset: contentReset, ...content } = useField("text");
  const { reset: nameReset, ...name } = useField("text");
  const { reset: numberReset, ...number } = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    contentReset();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    nameReset();
    numberReset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
