import personService from "./services/persons";

const Person = ({ person, persons, setPersons }) => {
  const deletePerson = (id) => {
    console.log(`button delete for ${id} pressed`);

    if (window.confirm(`Delete ${person.name}?`)) {
      console.log(`deleted ${person.name}`);
      personService
        .pop(person)
        .then(setPersons(persons.filter((p) => p !== person)));
    }
  };

  return (
    <>
      <p key={person.name}>
        {person.name} {person.number}
        <button key={person.name} onClick={() => deletePerson(person.id)}>
          delete
        </button>
      </p>
    </>
  );
};

export default Person;
