import axios from 'axios'

const GEO_URL = import.meta.env.VITE_OPENWEATHER_GEO_URL || 'https://api.openweathermap.org/geo/1.0'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/**
 * Search cities by name (autocomplete)
 */
export async function searchCities(query, limit = 5) {
  if (!query || query.trim().length < 2) return []
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query.trim(), limit, appid: API_KEY },
    timeout: 8000,
  })
  return data.map((item) => ({
    name: item.name,
    country: item.country,
    state: item.state || '',
    lat: item.lat,
    lon: item.lon,
    displayName: item.state
      ? `${item.name}, ${item.state}, ${item.country}`
      : `${item.name}, ${item.country}`,
  }))
}

/**
 * Get city name from coordinates (reverse geocoding)
 */
export async function reverseGeocode(lat, lon) {
  const { data } = await axios.get(`${GEO_URL}/reverse`, {
    params: { lat, lon, limit: 1, appid: API_KEY },
  })
  if (data.length === 0) return null
  return {
    name: data[0].name,
    country: data[0].country,
    state: data[0].state || '',
  }
}
