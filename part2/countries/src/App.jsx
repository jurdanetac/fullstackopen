import { useState, useEffect } from 'react'
import axios from 'axios'

import Countries from './Countries'
import countriesService from './services/countries'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [matching, setMatching] = useState([])

  // populate all countries list on initial render
  useEffect( () => {
    countriesService
      .getAll()
      .then( ( res ) => {
        setCountries( res.data )
      } ) }, [])

  // look matching countries every time search changes
  useEffect( () => {
    // only search if a filter is typed
    setMatching(
      countries.filter( c =>
        c.name.common.toLowerCase().includes( search.trim().toLowerCase() )
      )
    )
  }, [countries, search] )

  return (
    <div>
      <p>
        find countries
        <input
          name='search'
          value={search}
          placeholder='search countries by name'
          onChange={() => setSearch(event.target.value)} />
      </p>
      {search ? <Countries countries={matching} setMatching={setMatching} /> : null}
    </div>
  );
}

export default App
