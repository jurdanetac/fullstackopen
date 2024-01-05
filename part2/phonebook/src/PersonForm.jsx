import personService from "./services/persons";

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setMessage,
  setError,
}) => {
  const addPerson = (event) => {
    // stop browser from refreshing page
    event.preventDefault();

    // if empty inputs
    if (!newName) {
      alert("Enter a name!");
      return;
    } else if (!newNumber) {
      alert("Enter a number!");
      return;
    }

    const clearForm = () => {
      // clear inputs
      setNewName("");
      setNewNumber("");
    };

    // array of lowercase names without leading/trailing spaces
    const lowerCaseNames = persons.map((p) => p.name.trim().toLowerCase());

    // person created with data supplied by user on form
    const newPerson = { name: newName.trim(), number: newNumber.trim() };

    // verify if typed name exists in phonebook
    if (lowerCaseNames.includes(newPerson.name.toLowerCase())) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        // locate person id in db
        newPerson.id = persons.filter(
          (p) => p.name.toLowerCase() === newPerson.name.toLowerCase(),
        )[0].id;

        // update person in server's db
        personService
          .update(newPerson)
          .then(() => {
            // copy the array since we must not mutate state directly and
            // a = b would create a reference not a copy
            const newPersons = persons.slice();
            const personIndex = persons.indexOf(
              persons.filter((p) => p.id === newPerson.id)[0],
            );

            newPersons.splice(
              personIndex, // index of item to replace
              1, // item count to replace
              newPerson, // item to be replaced with
            );

            // update local array
            setPersons(newPersons);
          })
          .catch((error) => {
            // if person was deleted from server's db
            if (error.response.status === 404) {
              setError(
                `Information of '${newPerson.name}' has already been removed from server`,
              );
              setTimeout(() => setError(null), 5000);
              setPersons(persons.filter((p) => p.id !== newPerson.id));
              // if validation fails
            } else {
              setError(error.response.data.error);
              setTimeout(() => setError(null), 5000);
            }
          });
      }

      clearForm();

      return;
    }

    // save person in server's db
    personService
      .create(newPerson)
      .then(() => {
        personService
          .getAll() // get server's array with generated person id
          .then((res) => setPersons(res.data)) // update local array
          .then(() => {
            // notify success
            setMessage(`Added ${newPerson.name}`);
            setTimeout(() => setMessage(null), 5000);
          });
      })
      .catch((error) => {
        setError(error.response.data.error);
        setTimeout(() => setError(null), 5000);
      });

    clearForm();
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input
          value={newName}
          placeholder="enter a name"
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          placeholder="enter a phone number"
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
