const Header = (props: { name: string }): JSX.Element => {
  return <h1>{props.name}</h1>;
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Part = (props: { part: CoursePart }): JSX.Element => {
  const expand = (part: CoursePart) => {
    switch (part.kind) {
      case "basic":
        return (
          <>
            <em>{part.description}</em>
          </>
        );
      case "group":
        return <>project exercises {part.groupProjectCount}</>;
      case "background":
        return (
          <>
            <em>{part.description}</em>
            <br />
            submit to {part.backgroundMaterial}
          </>
        );
      case "special":
        return (
          <>
            <em>{part.description}</em>
            <br />
            required skills: {part.requirements.join(", ")}
          </>
        );
      default:
        return assertNever(part);
    }
  };

  const part: CoursePart = props.part;

  return (
    <>
      <p>
        <strong>
          {part.name} {part.exerciseCount}
        </strong>
        <br />
        {expand(part)}
      </p>
    </>
  );
};

const Content = (props: { courseParts: CoursePart[] }): JSX.Element => {
  return (
    <>
      {props.courseParts.map((part, index) => {
        return <Part key={index} part={part} />;
      })}
    </>
  );
};

const Total = (props: { totalExercises: number }): JSX.Element => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
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
