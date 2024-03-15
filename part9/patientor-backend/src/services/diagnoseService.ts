import { DiagnoseEntry } from "../types";

import diagnoseData from "../../data/diagnoses";

const entries: DiagnoseEntry[] = diagnoseData;

const getEntries = (): DiagnoseEntry[] => {
  return entries;
};

export default {
  getEntries,
};
