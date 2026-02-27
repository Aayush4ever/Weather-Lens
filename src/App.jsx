import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import SettingsPanel from './components/layout/SettingsPanel'
import CityDetailModal from './components/detail/CityDetailModal'
import ToastContainer from './components/ui/Toast'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import MapView from './pages/MapView'
import Alerts from './pages/Alerts'
import Login from './pages/Login'
import { useToast } from './hooks/useToast'
import { useDispatch } from 'react-redux'
import { setActiveCity } from './features/weather/weatherSlice'
import { fetchCityWeather } from './features/weather/weatherThunks'

function AppShell({ showToast }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dispatch = useDispatch()

  const handleCityAdded = (city) => dispatch(fetchCityWeather(city))
  const handleSidebarCityClick = (city) => dispatch(setActiveCity(city))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Navbar
        onToggleSettings={() => setSettingsOpen((o) => !o)}
        onCityAdded={handleCityAdded}
        showToast={showToast}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onCityClick={handleSidebarCityClick} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard showToast={showToast} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} showToast={showToast} />
      <CityDetailModal showToast={showToast} />
    </div>
  )
}

export default function App() {
  const { toasts, showToast, removeToast } = useToast()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell showToast={showToast} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}