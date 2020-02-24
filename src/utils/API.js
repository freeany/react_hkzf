import axios from 'axios'
import { REACT_APP_URL } from './getBaseUrl'
import { getToken, removeToken } from './index'
const API = axios.create({
  baseURL: REACT_APP_URL
})
API.interceptors.request.use(config => {
  if (
    config.url.startsWith('/user') &&
    !config.url.startsWith('/user/login') &&
    !config.url.startsWith('/user/registered')
  ) {
    // 添加 token
    config.headers.authorization = getToken()
  }

  return config
})

API.interceptors.response.use(res => {
  if (res.data.status === 400 && res.data.description === 'token异常或者过期') {
    removeToken()
    res.myRedirectTo = '/login'
  }
  return res
})
export { API }
