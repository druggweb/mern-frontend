import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mern-bc-frontend.herokuapp.com/'
})

export default api