import React, { FC, useState, useEffect } from "react";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import diaryService from "./services/diaryService";
import axios, { AxiosResponse } from "axios";

const Header: FC<{ text: string }> = ({ text }): JSX.Element => {
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

const Form: FC<FormProps> = ({
  submitHandler,
  date,
  setDate,
  visibility,
  setVisibility,
  weather,
  setWeather,
  comment,
  setComment,
}: FormProps): JSX.Element => {
  const visibilities: Visibility[] = ["great", "good", "ok", "poor"];
  const weathers: Weather[] = ["sunny", "rainy", "cloudy", "windy", "stormy"];

  return (
    <form onSubmit={submitHandler}>
      date{" "}
      <input
        value={date}
        onChange={(event) => setDate(event.target.value)}
        type="date"
        placeholder="date"
      />
      <br />
      visibility{" "}
      {visibilities.map((v: Visibility, index: number) => {
        // so that all radio buttons are in the same line
        const style: React.CSSProperties = {
          display: "inline",
        };

        return (
          <div style={style} key={index}>
            <input
              type="radio"
              id={v}
              name="v"
              value={v}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setVisibility(event.target.value)
              }
              checked={v === visibility}
            />
            <label htmlFor={v}>{v}</label>
          </div>
        );
      })}
      <br />
      weather{" "}
      {weathers.map((w: Weather, index: number) => {
        // so that all radio buttons are in the same line
        const style: React.CSSProperties = {
          display: "inline",
        };

        return (
          <div style={style} key={index}>
            <input
              type="radio"
              id={w}
              name="w"
              value={w}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setWeather(event.target.value)
              }
              checked={w === weather}
            />
            <label htmlFor={w}>{w}</label>
          </div>
        );
      })}
      <br />
      comment{" "}
      <input
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        type="text"
        placeholder="comment"
      />
      <button type="submit">add</button>
    </form>
  );
};

const Entries: FC<{ entries: DiaryEntry[] }> = ({ entries }): JSX.Element => {
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

const Notification: FC<{ message: string }> = ({
  message,
}): JSX.Element | null => {
  const style: React.CSSProperties = {
    color: "red",
  };

  if (message === "") {
    return null;
  }

  return <p style={style}>{message}</p>;
};

const App: FC = (): JSX.Element => {
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

  const submitHandler: (event: React.SyntheticEvent) => void = (event) => {
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
      <Form {...formProps} />
      <Entries entries={entries} />
    </div>
  );
};

export default App;
