const SearchFilter = ({ handleSearchChange }) => {
    return(
      <p>Search name <input onChange={handleSearchChange}></input></p>
    )
  }

export default SearchFilter