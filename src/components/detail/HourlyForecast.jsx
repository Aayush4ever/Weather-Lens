import React from 'react'
import { useSelector } from 'react-redux'
import { getWeatherIcon } from '../../utils/weatherIcons'
import { displayTemp } from '../../utils/tempUtils'
import { formatHour } from '../../utils/dateUtils'

export default function HourlyForecast({ cityName }) {
  const cityData = useSelector((s) => s.weather.cities[cityName])
  const unit = useSelector((s) => s.settings.unit)

  const hourly = cityData?.hourly || []

  if (hourly.length === 0) {
    return <div style={{ color: '#5a6a85', fontSize: '13px', padding: '8px 0' }}>No hourly data</div>
  }

  return (
    <div
      style={{
        display: 'flex', gap: '8px',
        overflowX: 'auto',
        paddingBottom: '6px',
      }}
    >
      {hourly.map((h, i) => {
        const icon = getWeatherIcon(h.icon)
        return (
          <div
            key={i}
            style={{
              flexShrink: 0,
              minWidth: '72px',
              textAlign: 'center',
              background: i === 0 ? 'rgba(79,142,247,0.12)' : '#111827',
              border: `1px solid ${i === 0 ? 'rgba(79,142,247,0.3)' : 'rgba(99,140,255,0.08)'}`,
              borderRadius: '12px',
              padding: '12px 8px',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { if (i !== 0) e.currentTarget.style.background = '#151f30' }}
            onMouseLeave={(e) => { if (i !== 0) e.currentTarget.style.background = '#111827' }}
          >
            <div style={{ fontSize: '11px', color: '#5a6a85', marginBottom: '6px', fontWeight: 500 }}>
              {i === 0 ? 'Now' : formatHour(h.dt)}
            </div>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{icon.emoji}</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              {displayTemp(h.temp, unit)}°
            </div>
            {h.pop > 10 && (
              <div style={{ fontSize: '10px', color: '#4f8ef7', marginTop: '4px' }}>
                💧{h.pop}%
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
