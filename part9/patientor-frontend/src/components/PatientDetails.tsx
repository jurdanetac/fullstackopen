import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import EntryForm from "./EntryForm";
import Entries from "./Entries";
import Information from "./Information";
import patientService from "../services/patients";

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
