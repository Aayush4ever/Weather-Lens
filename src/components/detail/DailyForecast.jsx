import React from 'react'
import { useSelector } from 'react-redux'
import { getWeatherIcon } from '../../utils/weatherIcons'
import { displayTemp } from '../../utils/tempUtils'
import { formatDayShort } from '../../utils/dateUtils'

export default function DailyForecast({ cityName }) {
  const cityData = useSelector((s) => s.weather.cities[cityName])
  const unit = useSelector((s) => s.settings.unit)
  const daily = cityData?.daily || []

  if (daily.length === 0) {
    return <div style={{ color: '#5a6a85', fontSize: '13px' }}>No forecast data</div>
  }

  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
      {daily.slice(0, 7).map((d, i) => {
        const icon = getWeatherIcon(d.icon)
        const hi = displayTemp(d.temp_max, unit)
        const lo = displayTemp(d.temp_min, unit)
        return (
          <div
            key={i}
            style={{
              flexShrink: 0,
              minWidth: '88px',
              textAlign: 'center',
              background: i === 0 ? 'rgba(79,142,247,0.12)' : '#111827',
              border: `1px solid ${i === 0 ? 'rgba(79,142,247,0.3)' : 'rgba(99,140,255,0.08)'}`,
              borderRadius: '14px',
              padding: '14px 10px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (i !== 0) { e.currentTarget.style.background = '#151f30'; e.currentTarget.style.borderColor = 'rgba(99,140,255,0.2)' } }}
            onMouseLeave={(e) => { if (i !== 0) { e.currentTarget.style.background = '#111827'; e.currentTarget.style.borderColor = 'rgba(99,140,255,0.08)' } }}
          >
            <div style={{ fontSize: '11px', color: '#5a6a85', fontWeight: 500, marginBottom: '8px' }}>
              {i === 0 ? 'Today' : formatDayShort(d.dt)}
            </div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon.emoji}</div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{hi}°</div>
            <div style={{ fontSize: '12px', color: '#5a6a85', marginTop: '2px' }}>{lo}°</div>
            {d.pop > 10 && (
              <div style={{ fontSize: '10px', color: '#4f8ef7', marginTop: '6px' }}>💧{d.pop}%</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
