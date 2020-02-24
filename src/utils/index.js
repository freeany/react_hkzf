import axios from 'axios'
import { setCity, getCity } from './citys'
import { REACT_APP_URL } from './getBaseUrl'
import { API } from './API.js'
import { setToken, getToken, removeToken } from './auth'

const getCurrentCity = () => {
  const currentCity = getCity()
  if (currentCity) {
    // console.log(currentCity)
    return Promise.resolve(currentCity)
  } else {
    const myCity = new window.BMap.LocalCity()
    return new Promise(resolve => {
      myCity.get(async result => {
        // console.log(result)
        // 这里有个不成文的规定， 使用area/info接口获取的城市如果没有房源，则返回上海
        const city = await axios.get(
          `http://localhost:8080/area/info?name=${result.name}`
        )
        setCity(city.data.body)
        resolve(city.data.body)
      })
    })
  }
}

export {
  getCurrentCity,
  setCity,
  getCity,
  REACT_APP_URL,
  API,
  setToken,
  getToken,
  removeToken
}
