import { createSlice } from '@reduxjs/toolkit'
import { fetchCityWeather } from './weatherThunks'

const INITIAL_CITIES = ['Patna', 'Noida', 'Manali', 'Mumbai']

const initialState = {
  cities: {},
  activeCityName: null,
  dashboardCities: INITIAL_CITIES,
}

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setActiveCity(state, action) {
      state.activeCityName = action.payload
    },
    clearActiveCity(state) {
      state.activeCityName = null
    },
    addDashboardCity(state, action) {
      const city = action.payload
      if (!state.dashboardCities.includes(city)) {
        state.dashboardCities.push(city)
      }
    },
    removeDashboardCity(state, action) {
      state.dashboardCities = state.dashboardCities.filter((c) => c !== action.payload)
      delete state.cities[action.payload]
    },
    clearCityError(state, action) {
      const city = action.payload
      if (state.cities[city]) {
        state.cities[city].error = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state, action) => {
        const city = action.meta.arg
        if (!state.cities[city]) {
          state.cities[city] = {
            current: null,
            forecast: null,
            daily: [],
            hourly: [],
            airQuality: null,
            loading: true,
            error: null,
            lastFetched: null,
          }
        } else {
          state.cities[city].loading = true
          state.cities[city].error = null
        }
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        const { city, current, daily, hourly, airQuality } = action.payload
        state.cities[city] = {
          current,
          daily,
          hourly,
          airQuality,
          loading: false,
          error: null,
          lastFetched: Date.now(),
        }
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        const city = action.meta.arg
        if (state.cities[city]) {
          state.cities[city].loading = false
          state.cities[city].error = action.error.message || 'Failed to fetch weather'
        }
      })
  },
})

export const {
  setActiveCity,
  clearActiveCity,
  addDashboardCity,
  removeDashboardCity,
  clearCityError,
} = weatherSlice.actions

export default weatherSlice.reducer
