const Header = (props) => {
  // Return a h1 header with the course name passed as a prop
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
}

const Part = (props) => {
  // Returns a paragraph of the name of a part and its exercise count

  return <p>{props.name} {props.exercises}</p>;
}

const Content = (props) => {
  // Returns the three parts and its exercise count

  return (
    <div>
      <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  );
}

const Total = (props) => {
  // Returns the total number of exercises

  return (
    <>
      <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </>
  );
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default App
