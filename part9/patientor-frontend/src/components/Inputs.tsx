import React, { useState } from "react";
import { TextField } from "@mui/material";

export const DateInput: React.FC<{
  date: string; // state
  label: string;
  setDate: (date: string) => void;
}> = ({ label, date, setDate }) => {
  const [focus, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <TextField
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      value={date}
      onChange={(e) => {
        if (e.target.value) setHasValue(true);
        else setHasValue(false);
        setDate(e.target.value);
      }}
      label={label}
      type={hasValue || focus ? "date" : "text"}
      variant="standard"
      id={label}
    />
  );
};

export const TextInput: React.FC<{
  value: string;
  setter: (value: string) => void;
  label: string;
}> = ({ value, setter, label }) => {
  return (
    <TextField
      value={value}
      onChange={(e) => setter(e.target.value)}
      id={label}
      label={label}
      variant="standard"
    />
  );
};
