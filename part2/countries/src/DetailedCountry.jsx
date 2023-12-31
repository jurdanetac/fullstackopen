import { useState, useEffect } from "react";

import countriesService from "./services/countries";

const DetailedCountry = ({ country }) => {
  // temperature at 2m above ground
  const [temperature, setTemperature] = useState(null);
  // wind speed at 10m above ground
  const [windSpeed10M, setWindSpeed10M] = useState(null);
  // weather code determines which icon to show
  const [weatherCode, setWeatherCode] = useState(null);
  // whether to show night or day icon
  const [isNight, setIsNight] = useState(null);

  // list of spoken languages
  let langs = [];

  // country.languages = {'spa': 'Spanish', 'eng': 'English'}
  for (let lang in country.languages) {
    langs = langs.concat(country.languages[lang]);
  }

  // latitude and longitude of the capital
  const [latitude, longitude] = country.capitalInfo.latlng;

  // useEffect prevents the API call from being made on every single render
  useEffect(() => {
    countriesService.getForecast({ latitude, longitude }).then((res) => {
      setTemperature(res.data.minutely_15.temperature_2m[0]);
      setWindSpeed10M(res.data.minutely_15.wind_speed_10m[0]);
      setWeatherCode(res.data.minutely_15.weather_code[0]);
      setIsNight(!Boolean(res.data.minutely_15.is_day[0]));
    });
  }, [latitude, longitude]);

  let imgPath = "/src/assets/";

  switch (weatherCode) {
    // Clear sky
    case 0:
      imgPath += isNight ? "01n.png" : "01d.png";
      break;

    // Mainly clear, partly cloudy, and overcast
    case 1:
    case 2:
    case 3:
      imgPath += isNight ? "02n.png" : "02d.png";
      break;

    // Fog and depositing rime fog
    case 45:
    case 48:
      imgPath += isNight ? "50n.png" : "50d.png";
      break;

    // Drizzle: Light, moderate, and dense intensity
    case 51:
    case 53:
    case 55:
    case 56: // Freezing Drizzle: Light and dense intensity
    case 57:
    case 80: // Rain showers: Slight, moderate, and violent
    case 81:
    case 82:
      imgPath += isNight ? "09n.png" : "09d.png";
      break;

    // Rain: Slight, moderate and heavy intensity
    case 61:
    case 63:
    case 65:
    case 66: // Freezing Rain: Light and heavy intensity
    case 67:
      imgPath += isNight ? "10n.png" : "10d.png";
      break;

    // Snow fall: Slight, moderate, and heavy intensity
    case 71:
    case 73:
    case 75:
    case 77: // Snow fall: Slight, moderate, and heavy intensity
    case 85: // Snow showers slight and heavy
    case 86:
      imgPath += isNight ? "13n.png" : "13d.png";
      break;

    // Thunderstorm: Slight or moderate
    case 95:
    case 96: // Thunderstorm with slight and heavy hail
    case 99:
      imgPath += isNight ? "11n.png" : "11d.png";
      break;

    default:
      imgPath = null;
      break;
  }

  return (
    <div>
      <h1>
        {country.name.common} {country.flag}
      </h1>

      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <p>
        <b>languages:</b>
      </p>
      <ul>
        {langs.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} width={150} height={"auto"} />

      <h2>Weather in {country.capital}</h2>

      <p>temperature {temperature} Celsius</p>
      <img src={imgPath} />
      <p>wind {windSpeed10M} m/s</p>
    </div>
  );
};

export default DetailedCountry;
