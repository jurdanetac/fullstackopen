/*
const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
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

  return (
    <div>
      <Total sum={parts[0].exercises + parts[1].exercises + parts[2].exercises} />
    </div>
  )
}

export default App
*/

/*
App
  Course
    Header
    Content
      Part
      Part
*/

const Header = ( { course } ) => <h1>{course}</h1>

const Part = ( { part } ) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ( { parts } ) => {
  return (
    parts.map(part =>
      <Part key={part.id} part={part} />)
  );
}

const Course = ( {course} ) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
    </>
  );
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App
