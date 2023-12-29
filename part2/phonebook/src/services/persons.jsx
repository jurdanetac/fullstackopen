import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const pop = object => {
  return axios.delete(`${baseUrl}/${object.id}`)
}

const update = object => {
  return axios.put(`${baseUrl}/${object.id}`, object)
}
export default { getAll, create, pop , update }
