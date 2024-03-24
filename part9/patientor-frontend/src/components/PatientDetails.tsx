import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import {
  Patient,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";
import Button from "@mui/material/Button";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
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
      <HeartIcon rating={entry.healthCheckRating} />
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

  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  const entryStyle: React.CSSProperties = {
    padding: "1rem",
    border: "1px solid black",
    borderRadius: "5px",
    marginBottom: "1rem",
  };

  return (
    <div>
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
      <h3>entries</h3>
      <div>
        {patient.entries.map((entry) => (
          <div key={entry.id} style={entryStyle}>
            <EntryDetails key={entry.id} entry={entry} />
          </div>
        ))}
      </div>
      <Button variant="contained">Add New Entry</Button>
    </div>
  );
};

export default PatientDetails;
