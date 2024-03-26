import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  NewEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../types";
import axios from "axios";
import Button from "@mui/material/Button";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

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

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Information: React.FC<{ patient: Patient }> = ({ patient }) => {
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
      <div style={style}>
        <h2>{patient.name}</h2>
        {patient.gender === "male" ? <MaleIcon /> : null}
        {patient.gender === "female" ? <FemaleIcon /> : null}
      </div>
      <p>
        ssn: {patient.ssn}
        <br />
        occupation: {patient.occupation}
      </p>
    </>
  );
};

const Entries: React.FC<{ patient: Patient }> = ({ patient }) => {
  const entryStyle: React.CSSProperties = {
    padding: "1rem",
    border: "1px solid black",
    borderRadius: "5px",
    marginBottom: "1rem",
    marginTop: "1rem",
  };

  return (
    <>
      <h3>entries</h3>
      <div>
        {patient.entries.map((entry) => (
          <div key={entry.id} style={entryStyle}>
            <EntryDetails key={entry.id} entry={entry} />
          </div>
        ))}
      </div>
      <Button variant="contained">Add New Entry</Button>
    </>
  );
};

const EntryForm: React.FC<{
  patient: Patient;
  setPatient: (patient: Patient) => void;
}> = ({ patient, setPatient }) => {
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

  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [codes, setCodes] = useState<string>("");
  const [notification, setNotification] = useNotification();

  const submit = async () => {
    const newEntry: NewEntry = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating: rating as unknown,
      diagnosisCodes: codes.split(", "),
    };

    try {
      const updatedPatient = await patientService.addEntry(
        patient.id,
        newEntry,
      );
      setPatient(updatedPatient);
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

    setCodes("");
    setDescription("");
    setDate("");
    setRating("");
    setSpecialist("");
  };

  return (
    <>
      {notification ? (
        <Alert severity="error" style={alertStyle}>
          {notification}
        </Alert>
      ) : null}
      <div style={formStyle}>
        <h3>New HealthCheck entry</h3>
        <div style={entryContainerStyle}>
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
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            id="rating"
            label="Rating"
            variant="standard"
          />
          <TextField
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            id="codes"
            label="Codes"
            variant="standard"
          />
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

const HeartIcon: React.FC<{ rating: number }> = ({ rating }) => {
  const heart: React.CSSProperties = {
    color:
      rating === 0
        ? "green"
        : rating === 1
          ? "yellow"
          : rating === 2
            ? "orange"
            : "red",
  };

  return <FavoriteIcon style={heart} />;
};

const HospitalEntryComponent: React.FC<{
  entry: HospitalEntry;
}> = ({ entry }) => {
  return (
    <div>
      {entry.date} <LocalHospitalIcon />
      <br />
      <i>{entry.description}</i>
      <br />
      discharged: {entry.discharge.date}
      <br />
      criteria: {entry.discharge.criteria}
    </div>
  );
};

const HealthCheckComponent: React.FC<{
  entry: HealthCheckEntry;
}> = ({ entry }) => {
  return (
    <div>
      {entry.date} <MedicalInformationIcon />
      <br />
      <i>{entry.description}</i>
      <br />
      <HeartIcon rating={entry.healthCheckRating} />
      <br />
      diagnose by: {entry.specialist}
    </div>
  );
};

const OccupationalHealthcareComponent: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <div>
      {entry.date} <WorkIcon /> {entry.employerName}
      <br />
      <i>{entry.description}</i>
      <br />
      diagnose by: {entry.specialist}
      <br />
      {entry.sickLeave ? (
        <>
          sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </>
      ) : null}
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryComponent entry={entry} />;
    case "HealthCheck":
      return <HealthCheckComponent entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareComponent entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient | null>(null);

  const id: string | undefined = useParams<{ id: string }>().id;

  useEffect(() => {
    if (!id) {
      return;
    }

    void patientService.getPatient(id).then((patient: Patient) => {
      if (patient) {
        setPatient(patient);
      } else {
        setPatient(null);
      }
    });
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {<Information patient={patient} />}
      {<EntryForm patient={patient} setPatient={setPatient} />}
      {<Entries patient={patient} />}
    </>
  );
};

export default PatientDetails;
