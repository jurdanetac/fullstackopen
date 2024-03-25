import {
  SickLeave,
  HealthCheckRating,
  Discharge,
  NewPatient,
  Gender,
  NewEntry,
  validEntryType,
  NewBaseEntry,
  DiagnoseEntry,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isType = (param: string): param is validEntryType => {
  return Object.values(validEntryType)
    .map((v) => v.toString())
    .includes(param);
};

const isObject = (object: unknown): object is object => {
  return typeof object === "object";
};

const isDischarge = (discharge: object): discharge is Discharge => {
  if (
    "date" in discharge &&
    isString(discharge.date) &&
    isDate(discharge.date) &&
    "criteria" in discharge &&
    isString(discharge.criteria)
  ) {
    return true;
  }

  return false;
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  if (isNaN(Number(param))) {
    return false;
  }

  return Object.values(HealthCheckRating).includes(Number(param));
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!isObject(discharge) || !isDischarge(discharge)) {
    throw new Error("Incorrect or missing discharge");
  }

  return discharge;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown,
): HealthCheckRating => {
  if (!isHealthCheckRating(healthCheckRating)) {
    throw new Error(
      "Incorrect or missing health check rating: " + healthCheckRating,
    );
  }

  return healthCheckRating;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error("Incorrect or missing employer name: " + employerName);
  }

  return employerName;
};

const isSickLeave = (sickLeave: unknown): sickLeave is SickLeave => {
  if (!isObject(sickLeave)) {
    return false;
  }

  if (
    "startDate" in sickLeave &&
    isString(sickLeave.startDate) &&
    isDate(sickLeave.startDate) &&
    "endDate" in sickLeave &&
    isString(sickLeave.endDate) &&
    isDate(sickLeave.endDate)
  ) {
    return true;
  }

  return false;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!isObject(sickLeave) || !isSickLeave(sickLeave)) {
    throw new Error("Incorrect or missing sick leave");
  }

  return sickLeave;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name: " + name);
  }

  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing date of birth: " + dateOfBirth);
  }

  return dateOfBirth;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing weather: " + gender);
  }
  return gender;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn: " + ssn);
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation: " + occupation);
  }

  return occupation;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!isObject(object)) {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatient = {
      name: parseName(object.name),
      ssn: parseSSN(object.ssn),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description: " + description);
  }

  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }

  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist: " + specialist);
  }

  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<DiagnoseEntry["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnoseEntry["code"]>;
  }

  return object.diagnosisCodes as Array<DiagnoseEntry["code"]>;
};

const parseType = (type: unknown): validEntryType => {
  if (!isString(type) || !isType(type)) {
    throw new Error("Incorrect or missing type: " + type);
  }

  return type;
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  // check base entry fields
  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "diagnosisCodes" in object &&
    "type" in object
  ) {
    // additional fields are checked afterwards and invalid fields are ignored
    const newBaseEntry: NewBaseEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    };

    const type = parseType(object.type);

    // check additional fields
    switch (type) {
      case validEntryType.Hospital:
        // check additional fields
        if ("discharge" in object) {
          const discharge = parseDischarge(object.discharge);

          return {
            ...newBaseEntry,
            discharge,
            type,
          };
        }
        break;
      case validEntryType.HealthCheck:
        // check additional fields
        if ("healthCheckRating" in object) {
          const healthCheckRating = parseHealthCheckRating(
            object.healthCheckRating,
          );

          return {
            ...newBaseEntry,
            healthCheckRating,
            type,
          };
        }
        break;
      case validEntryType.OccupationalHealthcare:
        // check additional fields
        if ("employerName" in object) {
          const employerName = parseEmployerName(object.employerName);
          if (!("sickLeave" in object)) {
            return {
              ...newBaseEntry,
              employerName,
              type,
            };
          } else {
            const sickLeave = parseSickLeave(object.sickLeave);

            return {
              ...newBaseEntry,
              employerName,
              sickLeave,
              type,
            };
          }
        }
        break;
      default:
        throw new Error("Incorrect or missing type: " + type);
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};
