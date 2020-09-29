import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mern-bc-api.herokuapp.com/'
})

export default api