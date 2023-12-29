import DetailedCountry from './DetailedCountry'

const Countries = ( { countries, setMatching } ) => {
  if ( countries.length > 10 ) {
    return ( <p>Too many matches, specify another filter</p> );
  } else if ( countries.length === 1 ) {
    return ( <DetailedCountry country={countries[0]} /> );
  }

  return (
    <div>
      {countries.map(c =>
        <p key={c.name.common}>
          {c.name.common}
          <button onClick={() => {
            setMatching([c])
          }}>
            show
          </button>
        </p>)}
    </div>
  );
}

export default Countries
