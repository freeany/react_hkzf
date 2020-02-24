const HKZF_TOKEN = 'hkzf_token'
const setToken = value => {
  localStorage.setItem(HKZF_TOKEN, value)
}
const getToken = () => {
  localStorage.getItem(HKZF_TOKEN)
}
const removeToken = () => {
  localStorage.removeItem(HKZF_TOKEN)
}

export { setToken, getToken, removeToken }
