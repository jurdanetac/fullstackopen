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
    <>
      <div>
        <Part name={props.names[0]} exercises={props.exerciseCount[0]} />
        <Part name={props.names[1]} exercises={props.exerciseCount[1]} />
        <Part name={props.names[2]} exercises={props.exerciseCount[2]} />
      </div>
    </>
  );
}

const Total = (props) => {
  // Returns the total number of exercises

  return (
    <>
      <p>Number of exercises {props.total}</p>
    </>
  );
}

const App = () => {
  // Main app component

  // Define the course name and the parts and their exercise count
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const parts = [part1, part2, part3]
  const exercises = [exercises1, exercises2, exercises3]

  return (
    <>
      <Header course={course} />
      <Content names={parts} exerciseCount={exercises}/>
      <Total total={exercises.reduce((a, b) => a + b, 0)} />
    </>
  );
}

export default App
