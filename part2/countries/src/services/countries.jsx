import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const get = ( { search } ) => {
  return axios.get(`${baseUrl}/name/${search}`)
}

const getAll = () => {
  return axios.get(`${baseUrl}/all`)
}

export default { get, getAll }
