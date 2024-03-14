import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises, ExerciseValues } from "./exerciseCalculator";

const app = express();
app.use(express.json());

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

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    daily_exercises,
    target,
  }: { daily_exercises: number[]; target: number } = req.body;

  // error handling
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  } else if (daily_exercises.some((d) => isNaN(d)) || isNaN(target)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // calculate exercise report
  const report: ExerciseValues = calculateExercises(daily_exercises, target);

  return res.json(report);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
