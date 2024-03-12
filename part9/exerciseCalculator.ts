interface ExerciseValues {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: number[], target: number): object => {
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

const dailyHours = [3, 0, 2, 4.5, 0, 3, 1];
console.log(calculateExercises(dailyHours, 2));
