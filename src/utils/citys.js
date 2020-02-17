const HKZF_CITY = 'hkzf_city'
const setCity = value => localStorage.setItem(HKZF_CITY, JSON.stringify(value))

const getCity = () => JSON.parse(localStorage.getItem(HKZF_CITY))

export { setCity, getCity }
