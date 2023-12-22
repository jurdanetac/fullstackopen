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
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const parts = [part1, part2, part3]
  const names = parts.map(part => part.name)
  const exerciseCounts = parts.map(part => part.exercises)

  return (
    <div>
      <Header course={course} />
      <Content names={names} exerciseCount={exerciseCounts} />
      <Total total={exerciseCounts.reduce((a, b) => a + b, 0)} />
    </div>
  );
}

export default App
