import { v1 as uuid } from "uuid";

import { NewEntry, Patient, NonSensitivePatient, NewPatient } from "../types";

import patientData from "../../data/patients";

const entries: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return entries;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return entries.map((e) => {
    return { ...e, ssn: undefined, entries: [] };
  });
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
  };

  entries.push(newPatient);

  return newPatient;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = entries.find((p) => p.id === id);
  return patient;
};

const addEntry = (patient: Patient, entry: NewEntry): Patient => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return patient;
};

export default {
  getPatient,
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  addEntry,
};
