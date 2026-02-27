import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveCity } from '../../features/weather/weatherSlice'
import { getWeatherIcon } from '../../utils/weatherIcons'
import { displayTemp } from '../../utils/tempUtils'

const navLinks = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    to: '/map',
    label: 'Map View',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    to: '/alerts',
    label: 'Alerts',
    badge: '2',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
]

export default function Sidebar({ onCityClick }) {
  const dispatch = useDispatch()
  const favorites = useSelector((s) => s.favorites.cities)
  const weatherCities = useSelector((s) => s.weather.cities)
  const unit = useSelector((s) => s.settings.unit)

  const handleFavClick = (city) => {
    dispatch(setActiveCity(city))
    if (onCityClick) onCityClick(city)
  }

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        padding: '20px 12px',
        borderRight: '1px solid rgba(99,140,255,0.12)',
        background: 'rgba(13,20,33,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}
    >
      {/* Nav Links */}
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: '#5a6a85',
            padding: '0 10px', marginBottom: '6px',
          }}
        >
          Navigation
        </div>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 10px',
              borderRadius: '10px',
              color: isActive ? '#4f8ef7' : '#8b9ab8',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid',
              borderColor: isActive ? 'rgba(79,142,247,0.2)' : 'transparent',
              background: isActive ? 'rgba(79,142,247,0.1)' : 'transparent',
              textDecoration: 'none',
              marginBottom: '2px',
            })}
          >
            {link.icon}
            <span style={{ flex: 1 }}>{link.label}</span>
            {link.badge && (
              <span
                style={{
                  background: '#ef4444', color: '#fff',
                  fontSize: '10px', fontWeight: 700,
                  padding: '2px 6px', borderRadius: '10px',
                }}
              >
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(99,140,255,0.08)', margin: '8px 0' }} />

      {/* Favorites */}
      <div>
        <div
          style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: '#5a6a85',
            padding: '0 10px', marginBottom: '6px',
          }}
        >
          Favorites
        </div>
        {favorites.length === 0 && (
          <div style={{ padding: '10px', fontSize: '12px', color: '#5a6a85', textAlign: 'center' }}>
            No favorites yet
          </div>
        )}
        {favorites.map((city) => {
          const cityData = weatherCities[city]
          const current = cityData?.current
          const icon = current ? getWeatherIcon(current.weather[0].icon) : null

          return (
            <div
              key={city}
              onClick={() => handleFavClick(city)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '10px',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#151f30'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '18px' }}>{icon?.emoji || '🌡️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px', fontWeight: 600, color: '#e8edf5',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {city}
                </div>
                <div style={{ fontSize: '11px', color: '#5a6a85', marginTop: '1px' }}>
                  {current ? current.weather[0].description : 'Loading...'}
                </div>
              </div>
              {current && (
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#7eb8ff', flexShrink: 0 }}>
                  {displayTemp(current.main.temp, unit)}°
                </span>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
