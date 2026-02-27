import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_CITIES = ['Patna', 'Noida', 'Manali', 'Mumbai']

const initialState = {
  cities: DEFAULT_CITIES,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const city = action.payload
      if (!state.cities.includes(city)) {
        state.cities.push(city)
      }
    },
    removeFavorite(state, action) {
      state.cities = state.cities.filter((c) => c !== action.payload)
    },
    toggleFavorite(state, action) {
      const city = action.payload
      const idx = state.cities.indexOf(city)
      if (idx === -1) {
        state.cities.push(city)
      } else {
        state.cities.splice(idx, 1)
      }
    },
    reorderFavorites(state, action) {
      state.cities = action.payload
    },
  },
})

export const { addFavorite, removeFavorite, toggleFavorite, reorderFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
