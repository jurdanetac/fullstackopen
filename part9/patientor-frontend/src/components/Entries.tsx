import Button from "@mui/material/Button";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Patient,
} from "../types";

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

export default Entries;
