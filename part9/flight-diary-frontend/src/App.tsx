import React, { useState, useEffect } from "react";
import { DiaryEntry } from "./types";
import diaryService from "./services/diaryService";

const Header = ({ text }: { text: string }) => {
  return <h2>{text}</h2>;
};

const Form = () => {
  return (
    <form>
      date <input type="date" placeholder="date" />
      <br />
      visibility <input type="text" placeholder="visibility" />
      <br />
      weather <input type="text" placeholder="weather" />
      <br />
      comment <input type="text" placeholder="comment" />
      <br />
      <button type="submit">add</button>
    </form>
  );
};

const Entries = ({ entries }: { entries: DiaryEntry[] }) => {
  return (
    <div>
      <h2>Entries</h2>
      {entries.map((entry, index) => (
        <div key={index}>
          <p>
            <b>{entry.date}</b>
          </p>
          visibility: {entry.visibility}
          <br />
          weather: {entry.weather}
          <br />
          comment: {entry.comment}
          <br />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      await diaryService
        .getAllDiaries()
        .then((entries: DiaryEntry[]) => setEntries(entries))
        .catch((error: Error) => console.error(error));
    };

    void fetchEntries();
  }, []);

  return (
    <div>
      <Header text="Add new entry" />
      <Form />
      <Entries entries={entries} />
    </div>
  );
};

export default App;
