const Header = (props: { name: string }): JSX.Element => {
  return <h1>{props.name}</h1>;
};

interface CoursePart {
  name: string;
  exerciseCount: number;
}

const Content = (props: { courseParts: CoursePart[] }): JSX.Element => {
  return (
    <>
      {props.courseParts.map((part, index) => {
        return (
          <p key={index}>
            {part.name} {part.exerciseCount}
          </p>
        );
      })}
    </>
  );
};

const Total = (props: { totalExercises: number }): JSX.Element => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
