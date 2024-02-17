import axios from 'axios'
import personsService from './services/persons'
import { useState, useEffect } from 'react'

const DisplayPerson = ({ person, deletePerson }) => {
  return (
      <li style={{listStyleType: "none"}}>
        {person.name} {person.number} <button onClick={deletePerson}>delete</button>
      </li>
  )
}

const SearchFilter = ({ handleSearchChange }) => {
  return(
    <p>Search name <input onChange={handleSearchChange}></input></p>
  )
}

const Message = ({ message, errorMessage }) => {
  if (message === null) {
    return null
  }
  let classMessage = 'message'
  if (errorMessage) {
    classMessage = 'messageRed'
  }
  return (
    <div className = {classMessage}>
      {message}
    </div>
  )
}

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button> 
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
    console.log("effect")
    personsService
      .getAll()
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response.data)
      })
  }, [])
  console.log("render", persons.length, "persons")

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    const isPersonInList = persons.find(person => person.name === newName)
    if (isPersonInList){
      if(window.confirm(`${newName} is already in the list. Do you want to replace the old number with the new one?`)) {
        const url = `http://localhost:3000/persons/${isPersonInList.id}`
        axios
          .put(url, {name: isPersonInList.name, number: newNumber})
          .then(response => {
            setPersons(persons.map(person => person.id !== isPersonInList.id ? person : response.data))
            setNewName("")
            setNewNumber("")
            setMessage(
              `${newName} had their number changed to ${newNumber}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== isPersonInList.id))
            setNewName("")
            setNewNumber("")
            setErrorMessage(true)
            setMessage(
              `Information of ${newName} has already been removed from the server`
            )
            setTimeout(() => {
              setMessage(null)
              setErrorMessage(false)
            }, 5000)
            console.log(errorMessage)
          })
      }
    }
    else {
      personsService
        .create(nameObject)
        .then( response => {
          setPersons(persons.concat(response.data))
          setNewName("")
          setNewNumber("")
          setMessage(`Added ${newName} to the phonebook`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    console.log(id + " button pressed")
    if (window.confirm("Do you really want to delete this number?")) {
      const url = `http://localhost:3000/persons/${id}`
      axios
        .delete(url)
        .then((response) => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(
            `Deleted ${(persons.find(person => person.id === id)).name} from the phonebook`
          )
          console.log(response)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
    }
  }

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newSearch))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    if(event.target.value.length > 0) {
      setShowAll(false)
    }
    else {
      setShowAll(true)
    }
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} errorMessage={errorMessage}/>
      <SearchFilter handleSearchChange={handleSearchChange} />
      <h2>Add a number</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <DisplayPerson
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person.id)}
        />
      )}
      {console.log(errorMessage)}
    </div>
  )
}

export default App