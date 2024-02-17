import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowCountry = ({ country, buttonClicked }) => {
  return (
    <li style={{listStyleType: "none"}}>{country.name} <button onClick={() => buttonClicked(country)}>show</button></li>
  )
}

const Display = ({ countriesDisplayed, buttonClicked }) => {
  if (countriesDisplayed.length > 10){
    return <div>Too many countries, please adjust filter</div>
  }
  else if (countriesDisplayed.length === 1){
    return null
  }
  else {
    return (
      countriesDisplayed.map(country => <ShowCountry key={country.name} country={country} buttonClicked={buttonClicked}/>)
    )
  }
}

const DisplaySingle = ({ singleCountry, singleCountryWeather }) => {
  if(singleCountry && singleCountryWeather) {
    return (
      <div>
        <h1>{singleCountry.name.common}</h1>
        <p>Capital: {singleCountry.capital}</p>
        <p>Area: {singleCountry.area} square kilometres</p>
        <b>Languages:</b>
        <ul>
          {Object.entries(singleCountry.languages).map(([key, value]) => 
            (<li key={value}>{value}</li>)
          )}
        </ul>
        <img src={singleCountry.flags.png}></img>
        <h2>Weather in {singleCountry.capital}</h2>
        <p>Temperature: {singleCountryWeather.main.temp} degrees Celcius</p>
        <p><img src={`https://openweathermap.org/img/wn/${singleCountryWeather.weather[0].icon}@2x.png`}></img></p>
        <p>Wind: {singleCountryWeather.wind.speed} m/s</p>
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")
  const [countriesDisplayed, setCountriesDisplayed] = useState([])
  const [singleCountry, setSingleCountry] = useState(null)
  const [singleCountryWeather, setSingleCountryWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get('http://localhost:3000/listOfCountries')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (singleCountry){
      getSingleCountryWeatherAPI(singleCountry)
    }
  }, [singleCountry])

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const displayCountries = (event) => {
    setCountriesDisplayed(countries.filter(country => country.name.toLowerCase().includes(event.target.value)))
  }

  const buttonClicked = (country) => {
    console.log("clicked " + country.name)
    getSingleCountryAPI(country.name)
  }

  const getSingleCountryAPI = (singleCountry) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${singleCountry}`)
      .then(response => {
        setSingleCountry(response.data)
      })
  }

  const getSingleCountryWeatherAPI = () => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${singleCountry.capital}&appid=${api_key}&units=metric`)
      .then(response =>{
      setSingleCountryWeather(response.data)
    })
  }

  useEffect(() => {
    if (countriesDisplayed.length === 1) {
      getSingleCountryAPI(countriesDisplayed[0].name)
    }
    else {
      setSingleCountry(null)
    }
  }, [search])

  return (
    <div>
      <h1>Find countries</h1>
      <form onChange = {displayCountries}>
        <input
          value={search}
          onChange={handleSearch}
        />
      </form>
      <Display countriesDisplayed={countriesDisplayed} singleCountry={singleCountry} setSingleCountry={setSingleCountry} buttonClicked={buttonClicked}/>
      <DisplaySingle singleCountry={singleCountry} singleCountryWeather={singleCountryWeather} />
    </div>
  )
}

export default App

