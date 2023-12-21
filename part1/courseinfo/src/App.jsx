const Header = (props) => {
  // Return a h1 header with the course name passed as a prop
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
}

const Content = (props) => {
  // Returns an unordered list of the parts and their exercise count

  return (
    <>
      <ul>
        <li>{props.names[0]} {props.exerciseCount[0]}</li>
        <li>{props.names[1]} {props.exerciseCount[1]}</li>
        <li>{props.names[2]} {props.exerciseCount[2]}</li>
      </ul>
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

  return (
    <>
      <Header course={course} />
      <Content names={[part1, part2, part3]} exerciseCount={[exercises1, exercises2, exercises3]}/>
      <Total total={exercises1 + exercises2 + exercises3} />
    </>
  );
}

export default App
