const DetailedCountry = ( { country } ) => {
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

export default DetailedCountry
