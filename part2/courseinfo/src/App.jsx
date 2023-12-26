/*
App
  Course
    Header
    Content
      Part
      Part
*/

const Title = ( { title } ) => <h1>{title}</h1>

const Total = ({ total }) => <p><b>total of {total} exercises</b></p>

const Header = ( { course } ) => <h2>{course}</h2>

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
  // sum of total exercises for the course
  const totalExercises = course.parts.reduce(
    (accumulator, currentPart) => accumulator + currentPart.exercises, // sum
    0 // initial value for the accumulator
  );

  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises} />
    </>
  );
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        },
      ]
    }
  ]

  const pageTitle = 'Web development curriculum'

  return (
    <div>
      <Title title={pageTitle} />
      {courses.map((course) => <Course key={course.id} course={course} />)}
    </div>
  )
}

export default App
