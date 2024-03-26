import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Alert,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";

import { Patient, NewEntry, validEntryType } from "../types";
import patientService from "../services/patients";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const useNotification = (): [string | null, (notification: string) => void] => {
  const [value, setValue] = useState<string | null>(null);

  const setNotification = (notification: string) => {
    setValue(notification);
    setTimeout(() => {
      setValue(null);
    }, 5000);
  };

  return [value, setNotification];
};

const EntryForm: React.FC<{
  patient: Patient;
  setPatient: (patient: Patient) => void;
}> = ({ patient, setPatient }) => {
  const [notification, setNotification] = useNotification();

  // base entry
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [codes, setCodes] = useState<string>("");

  const [type, setType] = useState<validEntryType>(validEntryType.HealthCheck);
  // health check
  const [rating, setRating] = useState<string>("");
  // hospital
  const [dateDischarged, setDateDischarged] = useState<string>("");
  const [criteria, setCriteria] = useState<string>("");
  // occupational
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStart, setSickLeaveStart] = useState<string>("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>("");

  const submit = async () => {
    const baseEntry: object = {
      description,
      date,
      specialist,
      diagnosisCodes: codes.split(", "),
    };

    let newEntry: NewEntry;

    switch (type) {
      case validEntryType.HealthCheck:
        newEntry = {
          type: validEntryType.HealthCheck,
          healthCheckRating: rating as unknown,
          ...baseEntry,
        };
        break;
      case validEntryType.Hospital:
        newEntry = {
          type: validEntryType.Hospital,
          discharge: {
            date: dateDischarged,
            criteria,
          },
          ...baseEntry,
        };
        break;
      case validEntryType.OccupationalHealthcare:
        if (sickLeaveStart && sickLeaveEnd) {
          newEntry = {
            type: validEntryType.OccupationalHealthcare,
            employerName,
            sickLeave: {
              startDate: sickLeaveStart,
              endDate: sickLeaveEnd,
            },
            ...baseEntry,
          };
        } else {
          newEntry = {
            type: validEntryType.OccupationalHealthcare,
            employerName,
            ...baseEntry,
          };
        }
        break;
      default:
        assertNever(type);
    }

    try {
      const updatedPatient = await patientService.addEntry(
        patient.id,
        newEntry,
      );

      // update patient state
      setPatient(updatedPatient);

      // clear all fields after successful submission
      setCodes("");
      setDescription("");
      setDate("");
      setRating("");
      setSpecialist("");
      setDateDischarged("");
      setCriteria("");
      setEmployerName("");
      setSickLeaveStart("");
      setSickLeaveEnd("");
      // backend rejects request
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "object") {
          const message = e.response.data.error.replace(
            "Something went wrong. Error: ",
            "",
          );
          console.error(message);
          setNotification(message);
        } else {
          setNotification("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setNotification("Unknown error");
      }
    }
  };

  const entryContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1rem",
  };

  const formStyle: React.CSSProperties = {
    border: "1px solid black",
    padding: "1rem",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
  };

  const alertStyle: React.CSSProperties = {
    marginBottom: "1rem",
  };

  const radioButtonsInlineStyle: React.CSSProperties = {
    display: "inline",
  };

  return (
    <>
      {notification ? (
        <Alert severity="error" style={alertStyle}>
          {notification}
        </Alert>
      ) : null}
      <div style={formStyle}>
        <h3>New {type} entry</h3>
        <div style={entryContainerStyle}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Entry Type
            </FormLabel>
            <RadioGroup
              value={type}
              onChange={(e) => setType(e.target.value)}
              name="radio-buttons-group"
              style={radioButtonsInlineStyle}
            >
              <FormControlLabel
                value={validEntryType.HealthCheck}
                control={<Radio />}
                label="Health Check"
              />
              <FormControlLabel
                value={validEntryType.Hospital}
                control={<Radio />}
                label="Hospital"
              />
              <FormControlLabel
                value={validEntryType.OccupationalHealthcare}
                control={<Radio />}
                label="Occupational Health Care"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            label="Description"
            variant="standard"
          />
          <TextField
            value={date}
            onChange={(e) => setDate(e.target.value)}
            id="date"
            label="Date"
            variant="standard"
          />
          <TextField
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            id="specialist"
            label="Specialist"
            variant="standard"
          />
          <TextField
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            id="codes"
            label="Codes"
            variant="standard"
          />
          {type === validEntryType.HealthCheck ? (
            <TextField
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              id="rating"
              label="Rating"
              variant="standard"
            />
          ) : null}
          {type === validEntryType.Hospital ? (
            <>
              <TextField
                value={dateDischarged}
                onChange={(e) => setDateDischarged(e.target.value)}
                id="dateDischarge"
                label="Discharge Date"
                variant="standard"
              />
              <TextField
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                id="criteria"
                label="Discharge Criteria"
                variant="standard"
              />
            </>
          ) : null}
          {type === validEntryType.OccupationalHealthcare ? (
            <>
              <TextField
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                id="employerName"
                label="Employer Name"
                variant="standard"
              />
              <TextField
                value={sickLeaveStart}
                onChange={(e) => setSickLeaveStart(e.target.value)}
                id="sickLeaveStart"
                label="Sick Leave Start"
                variant="standard"
              />
              <TextField
                value={sickLeaveEnd}
                onChange={(e) => setSickLeaveEnd(e.target.value)}
                id="sickLeaveEnd"
                label="Sick Leave End"
                variant="standard"
              />
            </>
          ) : null}
        </div>
        <div style={buttonContainerStyle}>
          <Button variant="contained" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={submit}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default EntryForm;
