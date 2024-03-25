import express from "express";

import { toNewPatient, toNewEntry } from "../utils";
import patientService from "../services/patientService";
import { NewEntry, Patient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedEntry = patientService.addPatient(newPatient);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  res.send(patient);
});

router.post("/:id/entries", (req, res) => {
  const id: string = req.params.id;
  const patient: Patient | undefined = patientService.getPatient(id);

  if (!patient) {
    return res.status(400).send({ error: "Patient not found" });
  }

  try {
    const entry: NewEntry = toNewEntry(req.body);
    const updatedPatient = patientService.addEntry(patient, entry);
    return res.send(updatedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    return res.status(400).send({ error: errorMessage });
  }
});

export default router;
