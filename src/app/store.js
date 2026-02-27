import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import weatherReducer from '../features/weather/weatherSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import settingsReducer from '../features/settings/settingsSlice'

// Persist favorites and settings across browser sessions
const favoritesPersistConfig = {
  key: 'weatherlens_favorites',
  storage,
}

const settingsPersistConfig = {
  key: 'weatherlens_settings',
  storage,
}

const rootReducer = combineReducers({
  weather: weatherReducer,
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)
