import React from "react";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Patient } from "../types";

const Information: React.FC<{ patient: Patient }> = ({ patient }) => {
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <>
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
    </>
  );
};

export default Information;
