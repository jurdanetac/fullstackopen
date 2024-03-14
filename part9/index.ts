import express from "express";
import { calculateBmi } from "./bmiCalculator";

const app = express();

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  // extract parameters in url
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  // check if parameters are missing or malformed
  if (!(height && weight) || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // calculate bmi
  const bmi: string = calculateBmi(height, weight);

  return res.json({ weight, height, bmi });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
