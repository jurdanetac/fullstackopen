interface Arguments {
  dailyHours: number[];
  target: number;
}

const parseArguments = (args: string[]): Arguments => {
  // at least 1 day is required
  if (args.length < 4) throw new Error("Not enough arguments");

  // check arguments are numbers
  args.slice(2).forEach((arg) => {
    if (isNaN(Number(arg))) {
      throw new Error("Provided values were not numbers!");
    }
  });

  // the first argument is the target value
  const target: number = Number(args[2]);

  // the rest of the arguments are the daily hours
  const dailyHours: number[] = args.slice(3).map((h) => Number(h));

  return {
    dailyHours,
    target,
  };
};

export interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyHours: number[],
  target: number,
): ExerciseValues => {
  // Write a function calculateExercises that calculates the average time of
  // daily exercise hours and compares it to the target amount of daily hours

  // the number of days
  const periodLength: number = dailyHours.length;
  // the number of training days
  const trainingDays: number = dailyHours.filter((h) => h > 0).length;
  // boolean value describing if the target was reached
  // let's assume 0 days are not counted as training days and are rest days
  const success: boolean =
    dailyHours.filter((h) => h >= target).length === trainingDays;
  const average: number = dailyHours.reduce((a, b) => a + b, 0) / periodLength;

  // a rating between the numbers 1-3 that tells how well the hours are met.
  // You can decide on the metric on your own.
  let rating: number = 0;
  // all trained days were successful, the rating is 3
  if (success) {
    rating = 3;
    // some of the trained days were successful, the rating is 2
  } else if (dailyHours.some((h) => h >= target)) {
    rating = 2;
    // none of the trained days were successful, the rating is 1
  } else {
    rating = 1;
  }

  // a text value explaining the rating, you can come up with the explanations
  let ratingDescription: string = "";
  switch (rating) {
    case 1:
      ratingDescription = "target not met";
      break;
    case 2:
      ratingDescription = "not too bad but could be better";
      break;
    case 3:
      ratingDescription = "target met";
      break;
    default:
      ratingDescription = "something went wrong with the rating system";
      break;
  }

  const returnValue: ExerciseValues = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };

  return returnValue;
};

const dailyHours: number[] = [3, 0, 2, 4.5, 0, 3, 1];
//console.log(calculateExercises(dailyHours, 2));
calculateExercises(dailyHours, 2);

try {
  const argv: string[] = process.argv;
  const { dailyHours, target } = parseArguments(argv);
  const result: object = calculateExercises(dailyHours, target);
  console.log(result);
} catch (error: unknown) {
  let errorMessage: string = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
