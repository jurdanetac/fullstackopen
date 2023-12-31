import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/";

const get = ({ search }) => {
  return axios.get(`${baseUrl}/name/${search}`);
};

const getAll = () => {
  return axios.get(`${baseUrl}/all`);
};

const weatherUrl = "https://api.open-meteo.com/v1/forecast/";

const getForecast = ({ latitude, longitude }) => {
  // https://open-meteo.com/en/docs
  return axios.get(
    `${weatherUrl}?latitude=${latitude}&longitude=${longitude}&forecast_minutely_15=1&wind_speed_unit=ms&minutely_15=temperature_2m,wind_speed_10m,weather_code,is_day`,
  );
};

export default { get, getAll, getForecast };
