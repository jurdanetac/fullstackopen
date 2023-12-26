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

export default Course
