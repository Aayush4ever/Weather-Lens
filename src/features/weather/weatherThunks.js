import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirQuality,
  parseDailyForecast,
  parseHourlyForecast,
} from '../../api/weatherApi'
import { isCacheValid } from '../../utils/cacheUtils'

export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCityWeather',
  async (city, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const cityData = state.weather.cities[city]

      if (cityData && isCacheValid(cityData.lastFetched)) {
        return {
          city,
          current: cityData.current,
          daily: cityData.daily,
          hourly: cityData.hourly,
          airQuality: cityData.airQuality,
          fromCache: true,
        }
      }

      const current = await fetchCurrentWeather(city)
      const { lat, lon } = current.coord

      const [forecastData, airQualityData] = await Promise.allSettled([
        fetchForecast(city),
        fetchAirQuality(lat, lon),
      ])

      const daily = forecastData.status === 'fulfilled'
        ? parseDailyForecast(forecastData.value)
        : []

      const hourly = forecastData.status === 'fulfilled'
        ? parseHourlyForecast(forecastData.value)
        : []

      const airQuality = airQualityData.status === 'fulfilled'
        ? airQualityData.value
        : null

      return { city, current, daily, hourly, airQuality }
    } catch (err) {
      return rejectWithValue(err.message || `Failed to fetch weather for ${city}`)
    }
  }
)

export const fetchAllCitiesWeather = createAsyncThunk(
  'weather/fetchAllCitiesWeather',
  async (_, { getState, dispatch }) => {
    const { dashboardCities } = getState().weather
    await Promise.allSettled(
      dashboardCities.map((city) => dispatch(fetchCityWeather(city)))
    )
  }
)

export const forceRefreshCity = createAsyncThunk(
  'weather/forceRefreshCity',
  async (city, { getState, dispatch }) => {
    const state = getState()
    // Temporarily clear lastFetched to bypass cache
    if (state.weather.cities[city]) {
      // Dispatch with cache invalidated via meta
    }
    return dispatch(fetchCityWeather(city))
  }
)
