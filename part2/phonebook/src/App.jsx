import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    // stop browser from refreshing page
    event.preventDefault()

    // if empty or if already in phonebook
    if (!newName) {
      alert('Enter a name!');
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
    setPersons(persons.concat({ name: newName }))

    // clear input
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} placeholder="enter a name" onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => <p key={p.name}>{p.name}</p>)}
    </div>
  )
}

export default App
