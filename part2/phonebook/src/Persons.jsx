const Persons = ( { persons, search } ) => {
  const toSearch = persons.filter((p) => p.name.trim().toLowerCase().includes(search));

  return (
    <>
      {toSearch.map((p) => <p key={p.name}>{p.name} {p.number}</p>)}
    </>
  );
}

export default Persons
