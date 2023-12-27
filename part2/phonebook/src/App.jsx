import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' , number: '040-1234567' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

    // verify if typed name exists in phonebook
    if (lowerCaseNames.includes(newName.trim().toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    // add person
    setPersons(persons.concat({ name: newName , number: newNumber }))

    // clear inputs
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map((p) => <p key={p.name}>{p.name} {p.number}</p>)}
    </div>
  )
}

export default App
