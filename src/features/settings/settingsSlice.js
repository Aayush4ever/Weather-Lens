import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  unit: 'C',           // 'C' or 'F'
  autoRefresh: true,   // auto-refresh every 60s
  compactCards: false,
  showWindDirection: true,
  notifications: true,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnit(state, action) {
      state.unit = action.payload
    },
    toggleAutoRefresh(state) {
      state.autoRefresh = !state.autoRefresh
    },
    toggleCompactCards(state) {
      state.compactCards = !state.compactCards
    },
    toggleWindDirection(state) {
      state.showWindDirection = !state.showWindDirection
    },
    toggleNotifications(state) {
      state.notifications = !state.notifications
    },
    setAllSettings(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  setUnit,
  toggleAutoRefresh,
  toggleCompactCards,
  toggleWindDirection,
  toggleNotifications,
  setAllSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
