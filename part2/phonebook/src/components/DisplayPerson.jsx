const DisplayPerson = ({ person, deletePerson }) => {
    return (
        <li style={{listStyleType: "none"}}>
          {person.name} {person.number} <button onClick={deletePerson}>delete</button>
        </li>
    )
  }

export default DisplayPerson