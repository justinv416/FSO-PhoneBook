import './App.css';
import {useState, useEffect} from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    personService
      .getAllPersons()
      .then(res => {
        setPersons(res.data)
      })
  }, [])

  const handleAddName = (event) => {
    setNewName(event.target.value)
  }

   const handleAddNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
      setSearchTerm(event.target.value)
      const findPerson = persons.filter(person => person.name.toLowerCase().includes(searchTerm))
      setPersons(findPerson)    
  }

  const handleAddPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(res => {
        const samePerson = persons.find(person => person.name === newName)
        if(samePerson) {
          alert(`${newName} is already added to the phonebook. Do you want to add a new number?`)
        } else {
          setPersons(persons.concat(res.data))
        }
    })
  }

  const handleDeletePerson = (id) => {
    const filteredPerson = persons.filter(person => person.id === id);
    const personToDelete = filteredPerson[0].id
    const confirmDelete = window.confirm(`Are you sure you want to delete ${filteredPerson[0].name}?`)
    if (confirmDelete) {
      personService.deletePerson(personToDelete)
      setPersons(persons.filter(person => person.id !== personToDelete))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Search: 
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>
      <form onSubmit={handleAddPerson}>
        <div>
          name: <input value={newName} onChange={handleAddName}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleAddNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => {
        return (
          <div key={person.id}>
            <p>{person.name}</p>
            <p>Number: {person.number}</p>
            <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default App;
