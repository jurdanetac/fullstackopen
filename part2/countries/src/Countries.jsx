const Countries = ( { countries } ) => {
  if ( countries.length > 10 ) {
    return ( <p>Too many matches, specify another filter</p> );
  } else if ( countries.length === 1 ) {
    const country = countries[0];

    return (
      <div>
        <h1>{ country.name.common } {country.flag}</h1>
        <p>capital { country.capital }</p>
        <p>area { country.area }</p>
        <p><b>languages:</b></p>
        <ul>
          { (() => {
            let langs = [];

            // country.languages = {'spa': 'Spanish', 'eng': 'English'}
            for ( let lang in country.languages ) {
              langs = langs.concat( country.languages[lang] )
            }

            return langs.map( lang => <li key={lang}>{lang}</li> )
          })() }
        </ul>
        <img src={country.flags.png}/>
      </div>
    );
  }

  return (
    <div>
      {countries.map(c => <p key={c.name.common}>{c.name.common}</p>)}
    </div>
  );
}

export default Countries
