import axios from 'axios'

const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.params = { ...config.params, appid: API_KEY, units: 'metric' }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Network error'
    return Promise.reject(new Error(msg))
  }
)

/**
 * show current weather by name of cityy
 */
export async function fetchCurrentWeather(city) {
  const { data } = await api.get('/weather', { params: { q: city } })
  return data
}

/**
 * shiw current weather
 */
export async function fetchCurrentWeatherByCoords(lat, lon) {
  const { data } = await api.get('/weather', { params: { lat, lon } })
  return data
}

/**
 * show 5-day / 3-hour forecast for a city
 */
export async function fetchForecast(city) {
  const { data } = await api.get('/forecast', { params: { q: city, cnt: 40 } })
  return data
}

/**
 * show forecast
 */
export async function fetchForecastByCoords(lat, lon) {
  const { data } = await api.get('/forecast', { params: { lat, lon, cnt: 40 } })
  return data
}

/**
 * air quality index show
 */
export async function fetchAirQuality(lat, lon) {
  const { data } = await api.get('/air_pollution', { params: { lat, lon } })
  return data
}

/**
 * forecast data for daily 
 */
export function parseDailyForecast(forecastData) {
  const days = {}
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    if (!days[key]) {
      days[key] = {
        dt: item.dt,
        temps: [],
        icons: [],
        descriptions: [],
        humidity: [],
        wind: [],
        pop: [],
      }
    }
    days[key].temps.push(item.main.temp)
    days[key].icons.push(item.weather[0].icon)
    days[key].descriptions.push(item.weather[0].description)
    days[key].humidity.push(item.main.humidity)
    days[key].wind.push(item.wind.speed)
    days[key].pop.push(item.pop * 100)
  })

  return Object.values(days)
    .slice(0, 7)
    .map((day) => ({
      dt: day.dt,
      temp_max: Math.max(...day.temps),
      temp_min: Math.min(...day.temps),
      icon: day.icons[Math.floor(day.icons.length / 2)],
      description: day.descriptions[0],
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind_speed: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 10) / 10,
      pop: Math.round(Math.max(...day.pop)),
    }))
}

export function parseHourlyForecast(forecastData) {
  return forecastData.list.slice(0, 16).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    humidity: item.main.humidity,
    wind_speed: item.wind.speed,
    wind_deg: item.wind.deg,
    pop: Math.round(item.pop * 100),
  }))
}
