import React from 'react'
import { useSelector } from 'react-redux'
import { displayTemp } from '../utils/tempUtils'
import { getWeatherIcon } from '../utils/weatherIcons'

const CITY_COORDS = {
  'New York': { x: 22, y: 35 },
  'London': { x: 47, y: 22 },
  'Tokyo': { x: 83, y: 35 },
  'Dubai': { x: 60, y: 42 },
  'Sydney': { x: 84, y: 72 },
  'Toronto': { x: 20, y: 30 },
  'Paris': { x: 49, y: 24 },
  'Berlin': { x: 52, y: 20 },
  'Singapore': { x: 77, y: 55 },
  'Mumbai': { x: 66, y: 44 },
  'São Paulo': { x: 30, y: 65 },
  'Seoul': { x: 81, y: 30 },
  'Cairo': { x: 56, y: 38 },
  'Moscow': { x: 58, y: 18 },
  'Lagos': { x: 50, y: 52 },
}

export default function MapView() {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)
  const unit = useSelector((s) => s.settings.unit)

  const loadedCities = dashboardCities.filter((c) => weatherCities[c]?.current)

  return (
    <div style={{ flex: 1, padding: '28px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700 }}>Map View</div>
        <div style={{ color: '#8b9ab8', fontSize: '14px', marginTop: '4px' }}>
          Geographic weather overview · {loadedCities.length} cities active
        </div>
      </div>

      <div
        style={{
          background: '#0d1421',
          border: '1px solid rgba(99,140,255,0.15)',
          borderRadius: '18px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '2/1',
          minHeight: '400px',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, #060a12 0%, #0a1628 40%, #060e1a 100%)',
          }}
        >
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#4f8ef7" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#4f8ef7" strokeWidth="0.5" />
            ))}
          </svg>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
            {/* North America */}
            <ellipse cx="20%" cy="35%" rx="12%" ry="18%" fill="#4f8ef7" />
            {/* South America */}
            <ellipse cx="28%" cy="65%" rx="7%" ry="15%" fill="#38d9a9" />
            {/* Europe */}
            <ellipse cx="50%" cy="25%" rx="6%" ry="10%" fill="#4f8ef7" />
            {/* Africa */}
            <ellipse cx="51%" cy="55%" rx="8%" ry="15%" fill="#f59e0b" />
            {/* Asia */}
            <ellipse cx="70%" cy="35%" rx="18%" ry="18%" fill="#4f8ef7" />
            {/* Australia */}
            <ellipse cx="83%" cy="70%" rx="6%" ry="8%" fill="#38d9a9" />
          </svg>
        </div>

        {/* City markers */}
        {loadedCities.map((city) => {
          const coords = CITY_COORDS[city] || { x: 50, y: 50 }
          const current = weatherCities[city].current
          const icon = getWeatherIcon(current.weather[0].icon)
          const temp = displayTemp(current.main.temp, unit)

          return (
            <div
              key={city}
              style={{
                position: 'absolute',
                left: `${coords.x}%`,
                top: `${coords.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              {/* Pulse ring */}
              <div
                style={{
                  position: 'absolute',
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: `${icon.accent}20`,
                  border: `1px solid ${icon.accent}40`,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
                }}
              />
              {/* Marker */}
              <div
                style={{
                  background: '#0d1421',
                  border: `1px solid ${icon.accent}60`,
                  borderRadius: '12px',
                  padding: '6px 10px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 600,
                  boxShadow: `0 4px 20px ${icon.accent}30`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.boxShadow = `0 8px 30px ${icon.accent}50`
                  e.currentTarget.style.zIndex = '20'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = `0 4px 20px ${icon.accent}30`
                }}
              >
                <span style={{ fontSize: '14px' }}>{icon.emoji}</span>
                <span style={{ color: '#e8edf5' }}>{city.split(' ')[0]}</span>
                <span style={{ color: icon.accent }}>{temp}°</span>
              </div>
            </div>
          )
        })}

        {/* Legend */}
        <div
          style={{
            position: 'absolute', bottom: '16px', right: '16px',
            background: 'rgba(13,20,33,0.9)',
            border: '1px solid rgba(99,140,255,0.15)',
            borderRadius: '12px', padding: '12px 16px',
            fontSize: '12px', color: '#8b9ab8',
          }}
        >
          <div style={{ fontWeight: 600, color: '#e8edf5', marginBottom: '6px' }}>Legend</div>
          {['Clear', 'Cloudy', 'Rain', 'Storm'].map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS_MAP[l] }} />
              {l}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes ping {
            75%, 100% { transform: translate(-50%,-50%) scale(2); opacity: 0; }
          }
        `}</style>
      </div>

      {/* City list below */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {loadedCities.map((city) => {
          const current = weatherCities[city].current
          const icon = getWeatherIcon(current.weather[0].icon)
          return (
            <div
              key={city}
              style={{
                background: '#151f30',
                border: '1px solid rgba(99,140,255,0.12)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{icon.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{city}</div>
                <div style={{ fontSize: '12px', color: '#5a6a85', textTransform: 'capitalize' }}>
                  {current.weather[0].description}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: icon.accent }}>
                {displayTemp(current.main.temp, unit)}°
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const COLORS_MAP = {
  Clear: '#f59e0b',
  Cloudy: '#9ca3af',
  Rain: '#4f8ef7',
  Storm: '#ef4444',
}
