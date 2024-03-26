import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Patient, NewEntry, validEntryType } from "../types";
import { DateInput, TextInput } from "./Inputs";
import { assertNever } from "../utils";
import useNotification from "../hooks/useNotification";
import patientService from "../services/patients";
import diagnosesService from "../services/diagnoses";
import MultipleSelect from "./MultipleSelect";
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

const EntryChooser: React.FC<{
  type: validEntryType;
  setType: (type: validEntryType) => void;
}> = ({ type, setType }) => {
  const radioButtonsInlineStyle: React.CSSProperties = {
    display: "inline",
  };

  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Entry Type</FormLabel>
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
  );
};

const NewEntryComponent: React.FC<{
  patient: Patient;
  setPatient: (patient: Patient) => void;
  setNotification: (notification: string) => void;
}> = ({ patient, setPatient, setNotification }) => {
  // base entry
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [codes, setCodes] = useState<string[]>([]);
  const [type, setType] = useState<validEntryType>(validEntryType.HealthCheck);
  // health check
  const [rating, setRating] = useState<string>("");
  // handler for input
  const ratingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setRating("");
    } else if (parseInt(e.target.value) >= 0 && parseInt(e.target.value) <= 3) {
      setRating(e.target.value);
    }
  };
  // hospital
  const [dateDischarged, setDateDischarged] = useState<string>("");
  const [criteria, setCriteria] = useState<string>("");
  // occupational
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStart, setSickLeaveStart] = useState<string>("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>("");

  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnosisCodes(diagnoses.map((d) => d.code));
    };
    fetchDiagnoses();
  }, []);

  const submit = async () => {
    const baseEntry: object = {
      description,
      date,
      specialist,
      diagnosisCodes: codes,
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
      setCodes([]);
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

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "1rem",
      }}
    >
      <h3>New {type} entry</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <EntryChooser type={type} setType={setType} />
        <TextInput
          value={description}
          setter={setDescription}
          label="Description"
        />
        <DateInput label="Date" date={date} setDate={setDate} />
        <TextInput
          value={specialist}
          setter={setSpecialist}
          label="Specialist"
        />
        <MultipleSelect
          code={codes}
          setCode={setCodes}
          codes={diagnosisCodes}
        />

        {type === validEntryType.HealthCheck ? (
          <TextField
            value={rating}
            onChange={(e) => ratingChange(e)}
            id="rating"
            label="Rating"
            variant="standard"
            type="number"
          />
        ) : null}
        {type === validEntryType.Hospital ? (
          <>
            <DateInput
              label="Discharge Date"
              date={dateDischarged}
              setDate={setDateDischarged}
            />
            <TextInput value={criteria} setter={setCriteria} label="Criteria" />
          </>
        ) : null}
        {type === validEntryType.OccupationalHealthcare ? (
          <>
            <TextInput
              value={employerName}
              setter={setEmployerName}
              label="Employer Name"
            />
            <DateInput
              label="Sick Leave Start"
              date={sickLeaveStart}
              setDate={setSickLeaveStart}
            />
            <DateInput
              label="Sick Leave End"
              date={sickLeaveEnd}
              setDate={setSickLeaveEnd}
            />
          </>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" color="error">
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={submit}>
          Add
        </Button>
      </div>
    </div>
  );
};

const EntryForm: React.FC<{
  patient: Patient;
  setPatient: (patient: Patient) => void;
}> = ({ patient, setPatient }) => {
  const [notification, setNotification] = useNotification();

  return (
    <>
      {notification ? (
        <Alert
          severity="error"
          style={{
            marginBottom: "1rem",
          }}
        >
          {notification}
        </Alert>
      ) : null}
      <NewEntryComponent
        setNotification={setNotification}
        patient={patient}
        setPatient={setPatient}
      />
    </>
  );
};

export default EntryForm;
