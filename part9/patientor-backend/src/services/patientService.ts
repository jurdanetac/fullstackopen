import { PatientEntry, NonSensitivePatientEntry } from "../types";

import patientData from "../../data/patients";

const entries: PatientEntry[] = patientData as PatientEntry[];

const getEntries = (): PatientEntry[] => {
  return entries;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return entries.map((e) => {
    const { ssn, ...rest } = e;
    return rest;
  });
};

export default {
  getEntries,
  getNonSensitiveEntries,
};
