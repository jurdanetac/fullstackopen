// BMI = weight (kg) / (height (m) * height (m))
interface BMIValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters: number = height / 100;
  const bmi: number = weight / (heightInMeters * heightInMeters);

  // BMI Categories:
  // https://en.wikipedia.org/wiki/Body_mass_index#Categories
  if (bmi < 16) {
    return "Underweight (Severe thinness)";
  } else if (bmi <= 16.9) {
    return "Underweight (Moderate thinness)";
  } else if (bmi <= 18.4) {
    return "Underweight (Mild thinness)";
  } else if (bmi <= 24.9) {
    return "Normal (healthy weight)";
  } else if (bmi <= 29.9) {
    return "Overweight (Pre-obese)";
  } else if (bmi <= 34.9) {
    return "Obese (Class I)";
  } else if (bmi <= 39.9) {
    return "Obese (Class II)";
  } else {
    return "Obese (Class III)";
  }
};

try {
  const argv: string[] = process.argv;
  const { height, weight } = parseArguments(argv);
  const bmi: string = calculateBmi(height, weight);
  console.log(bmi);
} catch (error: unknown) {
  let errorMessage: string = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
