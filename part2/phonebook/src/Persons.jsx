import Person from "./Person";

const Persons = ({ persons, search, setPersons }) => {
  const toSearch = persons.filter((p) =>
    p.name.trim().toLowerCase().includes(search),
  );

  return (
    <>
      {toSearch.map((p) => (
        <Person
          key={p.id}
          person={p}
          persons={persons}
          setPersons={setPersons}
        />
      ))}
    </>
  );
};

export default Persons;
