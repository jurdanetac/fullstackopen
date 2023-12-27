import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    // stop from refreshing page
    event.preventDefault()
    console.log('button pressed')

    // add person
    setPersons(persons.concat({ name: newName }))
    // clear input
    setNewName('')
  }

  const handleAddPerson = (event) => {
    console.log(event)

    // append letter
    if (event.nativeEvent.inputType === 'insertText') {
      setNewName(newName + event.nativeEvent.data)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleAddPerson} />
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
