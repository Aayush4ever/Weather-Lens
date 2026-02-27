import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setUnit,
  toggleAutoRefresh,
  toggleCompactCards,
  toggleWindDirection,
  toggleNotifications,
} from '../../features/settings/settingsSlice'
import Toggle from '../ui/Toggle'

export default function SettingsPanel({ open, onClose, showToast }) {
  const dispatch = useDispatch()
  const settings = useSelector((s) => s.settings)
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENWEATHER_API_KEY || '')

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      showToast('Please enter a valid API key', 'warning')
      return
    }
    showToast('API key saved! Add it to your .env file as VITE_OPENWEATHER_API_KEY', 'success')
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0,
            zIndex: 149,
            background: 'rgba(0,0,0,0.3)',
          }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: '64px', right: 0, bottom: 0,
          zIndex: 150,
          width: '300px',
          background: '#0d1421',
          borderLeft: '1px solid rgba(99,140,255,0.22)',
          padding: '24px',
          overflowY: 'auto',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
            ⚙️ Settings
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#151f30', border: '1px solid rgba(99,140,255,0.12)',
              borderRadius: '8px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#8b9ab8', fontSize: '16px',
            }}
          >✕</button>
        </div>

        {/* Temperature Unit */}
        <SettingGroup label="Temperature Unit">
          <div
            style={{
              display: 'flex',
              background: '#151f30',
              border: '1px solid rgba(99,140,255,0.12)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {['C', 'F'].map((u) => (
              <button
                key={u}
                onClick={() => {
                  dispatch(setUnit(u))
                  showToast(`Switched to ${u === 'C' ? 'Celsius' : 'Fahrenheit'}`, 'info')
                }}
                style={{
                  flex: 1, padding: '10px',
                  border: 'none',
                  background: settings.unit === u ? '#4f8ef7' : 'transparent',
                  color: settings.unit === u ? '#fff' : '#8b9ab8',
                  fontWeight: 600, fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                {u === 'C' ? '°C — Celsius' : '°F — Fahrenheit'}
              </button>
            ))}
          </div>
        </SettingGroup>

        {/* Data Refresh */}
        <SettingGroup label="Data Refresh">
          <SettingRow
            label="Auto-refresh (every 60s)"
            sub="Data stays fresh automatically"
          >
            <Toggle
              checked={settings.autoRefresh}
              onChange={() => dispatch(toggleAutoRefresh())}
            />
          </SettingRow>
          <SettingRow
            label="Push Notifications"
            sub="Alert for severe weather"
          >
            <Toggle
              checked={settings.notifications}
              onChange={() => dispatch(toggleNotifications())}
            />
          </SettingRow>
        </SettingGroup>

        {/* Display */}
        <SettingGroup label="Display">
          <SettingRow
            label="Compact Cards"
            sub="Smaller city cards on dashboard"
          >
            <Toggle
              checked={settings.compactCards}
              onChange={() => dispatch(toggleCompactCards())}
            />
          </SettingRow>
          <SettingRow
            label="Show Wind Direction"
            sub="Display compass on cards"
          >
            <Toggle
              checked={settings.showWindDirection}
              onChange={() => dispatch(toggleWindDirection())}
            />
          </SettingRow>
        </SettingGroup>

        {/* API Key */}
        <SettingGroup label="API Configuration">
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenWeatherMap API Key..."
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#151f30',
                border: '1px solid rgba(99,140,255,0.12)',
                borderRadius: '10px',
                color: '#e8edf5',
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={saveApiKey}
            style={{
              width: '100%', padding: '10px',
              background: '#4f8ef7', color: '#fff',
              border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#3d7de8'}
            onMouseLeave={(e) => e.target.style.background = '#4f8ef7'}
          >
            Save API Key
          </button>
          <p style={{ fontSize: '11px', color: '#5a6a85', marginTop: '8px', lineHeight: '1.5' }}>
            Get a free key at{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#4f8ef7' }}
            >
              openweathermap.org
            </a>
          </p>
        </SettingGroup>
      </div>
    </>
  )
}

function SettingGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: '#5a6a85',
          marginBottom: '10px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, sub, children }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        background: '#151f30',
        border: '1px solid rgba(99,140,255,0.12)',
        borderRadius: '10px',
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: '#5a6a85', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}
