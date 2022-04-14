import './App.css';
import {useState, useEffect} from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null)

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

    const findPerson = persons.filter(person => person.name === newName)
    const samePerson = findPerson[0];
    

    if(samePerson) {
      const confirmPerson = window.confirm(`${samePerson.name} has already been added`)
      if(confirmPerson) {
        
        const updatedPerson = {
           ...samePerson,
          number: newNumber
        }
        
        personService
          .update(samePerson.id, updatedPerson)
          .then(res => {
            setPersons(persons.map(person => person.id !== samePerson.id ? person : res.data))
            setMessage(`${updatedPerson.name} number has been changed.`)

            setTimeout(() => {
              setMessage(null)
            }, 5000)
          }) 
          .catch(err => {
            console.log(err)
            setMessage(`${samePerson.name} has already been deleted`)

            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {

       personService
      .create(newPerson)
      .then(res => {
          setPersons(persons.concat(res.data))
          setMessage(`${newPerson.name} Added to phone book`)

          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
    }
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
    <div className='App'>
      <h2>Phonebook</h2>
      <div className='error'>
        {message}
      </div>
      <div>
        Search: 
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>
      <h2>Add new person:</h2>
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
