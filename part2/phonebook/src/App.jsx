import personsService from './services/persons'
import { useState, useEffect } from 'react'

import DisplayPerson from './components/DisplayPerson'
import Message from './components/Message'
import PersonForm from './components/PersonForm'
import SearchFilter from './components/SearchFilter'

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

  const handleMessage = (message, isError) => {
    setNewName("")
    setNewNumber("")
    setErrorMessage(isError)
    setMessage(message)
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    const isPersonInList = persons.find(person => person.name === newName)
    if (isPersonInList){
      if(window.confirm(`${newName} is already in the list. Do you want to replace the old number with the new one?`)) {
        personsService
          .update(isPersonInList.id, {name: isPersonInList.name, number: newNumber})
          .then(response => {
            console.log(response.data)
            setPersons(persons.map(person => person.id !== isPersonInList.id ? person : {name: isPersonInList.name, number: newNumber, id: person.id}))
            handleMessage(`${newName} had their number changed to ${newNumber}`, false)
          })
          .catch(error => {
            console.log(error)
            if (error.response.status === 404) {
              setPersons(persons.filter(person => person.id !== isPersonInList.id))
              handleMessage(`Information of ${newName} has already been removed from the server`, true)
              console.log(errorMessage)
            }
            else {
              handleMessage(error.response.data.error, true)
            }
          })
      }
    }
    else {
      personsService
        .create(nameObject)
        .then( response => {
          setPersons(persons.concat(response.data))
          handleMessage(`Added ${newName} to the phonebook`, false)
        })
        .catch(error => {
          handleMessage(error.response.data.error, true)
        })
    }
  }

  const deletePerson = (id) => {
    console.log(id + " button pressed")
    if (window.confirm("Do you really want to delete this number?")) {
      personsService
        .del(id)
        .then((response) => {
          setPersons(persons.filter(person => person.id !== id))
          handleMessage(`Deleted ${(persons.find(person => person.id === id)).name} from the phonebook`, false)
          console.log(response)
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
      <Message message={message} errorMessage={errorMessage} setMessage={setMessage}/>
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