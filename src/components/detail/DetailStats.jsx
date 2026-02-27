import React from 'react'
import { useSelector } from 'react-redux'
import { displayTemp } from '../../utils/tempUtils'
import { getUVLevel, getAQILabel } from '../../utils/weatherIcons'

export default function DetailStats({ cityName }) {
  const cityData = useSelector((s) => s.weather.cities[cityName])
  const unit = useSelector((s) => s.settings.unit)

  if (!cityData?.current) return null
  const { current, airQuality } = cityData
  const m = current.main
  const w = current.wind

  const uvLevel = getUVLevel(current.uvi || 0)
  const aqi = airQuality?.list?.[0]?.main?.aqi
  const aqiInfo = aqi ? getAQILabel(aqi) : null

  const stats = [
    { icon: '🌡️', label: 'Feels Like', value: `${displayTemp(m.feels_like, unit)}°${unit}` },
    { icon: '💧', label: 'Humidity', value: `${m.humidity}%` },
    { icon: '📊', label: 'Pressure', value: `${m.pressure} hPa` },
    { icon: '☁️', label: 'Cloud Cover', value: `${current.clouds?.all ?? '—'}%` },
    { icon: '👁️', label: 'Visibility', value: `${((current.visibility || 0) / 1000).toFixed(1)} km` },
    { icon: '💨', label: 'Wind Speed', value: `${Math.round(w.speed * 3.6)} km/h` },
    { icon: '🌬️', label: 'Wind Gust', value: w.gust ? `${Math.round(w.gust * 3.6)} km/h` : '—' },
    { icon: '☀️', label: 'UV Index', value: `${current.uvi ?? '—'}`, sub: uvLevel.label, subColor: uvLevel.color },
    { icon: '🌫️', label: 'Dew Point', value: `${displayTemp(m.temp_min, unit)}°${unit}`, sub: 'approx.' },
    { icon: '⬆️', label: 'Temp Max', value: `${displayTemp(m.temp_max, unit)}°${unit}` },
    { icon: '⬇️', label: 'Temp Min', value: `${displayTemp(m.temp_min, unit)}°${unit}` },
    ...(aqiInfo ? [{ icon: '🌿', label: 'Air Quality', value: aqiInfo.label, subColor: aqiInfo.color }] : []),
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: '#151f30',
            border: '1px solid rgba(99,140,255,0.1)',
            borderRadius: '12px',
            padding: '14px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#5a6a85', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            {s.icon} {s.label}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e8edf5' }}>
            {s.value}
          </div>
          {s.sub && (
            <div style={{ fontSize: '11px', color: s.subColor || '#5a6a85', marginTop: '2px', fontWeight: 500 }}>
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
