import React, { useState, useEffect } from "react";
import { DiaryEntry, NewDiaryEntry } from "./types";
import diaryService from "./services/diaryService";
import axios, { AxiosResponse } from "axios";

const Header = ({ text }: { text: string }) => {
  return <h2>{text}</h2>;
};

interface FormProps {
  submitHandler: (event: React.SyntheticEvent) => void;
  date: string;
  setDate: (date: string) => void;
  visibility: string;
  setVisibility: (visibility: string) => void;
  weather: string;
  setWeather: (weather: string) => void;
  comment: string;
  setComment: (comment: string) => void;
}

const Form = ({ props }: { props: FormProps }) => {
  const {
    submitHandler,
    date,
    setDate,
    visibility,
    setVisibility,
    weather,
    setWeather,
    comment,
    setComment,
  } = props;

  return (
    <form onSubmit={submitHandler}>
      date{" "}
      <input
        value={date}
        onChange={(event) => setDate(event.target.value)}
        type="text"
        placeholder="date"
      />
      <br />
      visibility{" "}
      <input
        value={visibility}
        onChange={(event) => setVisibility(event.target.value)}
        type="text"
        placeholder="visibility"
      />
      <br />
      weather{" "}
      <input
        value={weather}
        onChange={(event) => setWeather(event.target.value)}
        type="text"
        placeholder="weather"
      />
      <br />
      comment{" "}
      <input
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        type="text"
        placeholder="comment"
      />
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

const Notification = ({ message }: { message: string }) => {
  const style = {
    color: "red",
  };

  if (message === "") {
    return null;
  }

  return <p style={style}>{message}</p>;
};

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    setTimeout(() => {
      setNotification("");
    }, 10000);
  });

  // form states
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    diaryService
      .getAllDiaries()
      .then((entries: DiaryEntry[]) => setEntries(entries))
      .catch((error: Error) => console.error(error));
  }, []);

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newDiaryEntry: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment,
    };

    diaryService
      .createDiary(newDiaryEntry)
      .then((entry: DiaryEntry) => setEntries(entries.concat(entry)))
      .catch((error: Error) => {
        if (axios.isAxiosError(error)) {
          const response: AxiosResponse = error.response as AxiosResponse;
          setNotification(String(response.data));
        } else {
          console.error(error);
        }
      });

    // flush inputs
    setDate("");
    setVisibility("");
    setWeather("");
    setComment("");
  };

  const formProps: FormProps = {
    submitHandler,
    date,
    setDate,
    visibility,
    setVisibility,
    weather,
    setWeather,
    comment,
    setComment,
  };

  return (
    <div>
      <Header text="Add new entry" />
      <Notification message={notification} />
      <Form props={formProps} />
      <Entries entries={entries} />
    </div>
  );
};

export default App;
