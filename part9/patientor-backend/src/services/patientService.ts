import { v1 as uuid } from "uuid";

import {
  PatientEntry,
  NonSensitivePatientEntry,
  NewPatientEntry,
} from "../types";

import patientData from "../../data/patients";

const entries: PatientEntry[] = patientData;

const getEntries = (): PatientEntry[] => {
  return entries;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return entries.map((e) => {
    return { ...e, ssn: undefined };
  });
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry: PatientEntry = {
    id: uuid(),
    ...entry,
  };

  entries.push(newPatientEntry);

  return newPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
