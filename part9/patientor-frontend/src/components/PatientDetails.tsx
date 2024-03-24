import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import patientService from "../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Entry } from "../types";

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
      {patient.entries.map((entry: Entry) => (
        <div key={entry.id}>
          <p>
            {entry.date} {entry.description}
          </p>
          <ul>
            {entry.diagnosisCodes?.map((code) => <li key={code}>{code}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientDetails;
