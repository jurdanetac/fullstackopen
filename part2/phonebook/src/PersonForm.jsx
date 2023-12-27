import personService from './services/persons'

const PersonForm = ( { persons, setPersons, newName, setNewName, newNumber, setNewNumber } ) => {
  const addPerson = (event) => {
    // stop browser from refreshing page
    event.preventDefault()

    // if empty inputs
    if (!newName) {
      alert('Enter a name!');
      return;
    } else if (!newNumber) {
      alert('Enter a number!');
      return;
    }

    // array of lowercase names without leading/trailing spaces
    const lowerCaseNames = persons.map((p) => p.name.trim().toLowerCase());

    const newPerson = { name: newName.trim(), number: newNumber.trim() }

    // verify if typed name exists in phonebook
    if (lowerCaseNames.includes(newPerson.name.toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    // save person in server's db
    personService.create(newPerson)
      .then(() => {
        // add person
        setPersons(persons.concat(newPerson))
      })

    // clear inputs
    setNewName('')
    setNewNumber('')
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} placeholder="enter a name" onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} placeholder="enter a phone number" onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm
