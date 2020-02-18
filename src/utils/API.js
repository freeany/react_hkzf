import axios from 'axios'
import { REACT_APP_URL } from './getBaseUrl'
const API = axios.create({
  baseURL: REACT_APP_URL
})
export { API }
