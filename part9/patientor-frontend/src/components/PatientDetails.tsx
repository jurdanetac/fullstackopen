import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import patientService from "../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient | null>(null);

  const id: string | undefined = useParams<{ id: string }>().id;

  useEffect(() => {
    void patientService.getPatient(id).then((patient: Patient) => {
      setPatient(patient);
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
    </div>
  );
};

export default PatientDetails;
