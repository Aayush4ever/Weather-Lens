import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getWeatherIcon } from '../utils/weatherIcons'
import { displayTemp } from '../utils/tempUtils'

const ALERT_TYPES = {
  storm: { icon: '⛈️', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  wind: { icon: '🌬️', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  rain: { icon: '🌊', color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.25)' },
  frost: { icon: '❄️', color: '#93c5fd', bg: 'rgba(147,197,253,0.08)', border: 'rgba(147,197,253,0.25)' },
  uv: { icon: '☀️', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  fog: { icon: '🌫️', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' },
}

const MOCK_ALERTS = [
  { id: 1, type: 'storm', city: 'New York', title: 'Severe Thunderstorm Warning', description: 'Heavy thunderstorms expected from 8 PM to 2 AM. Wind gusts up to 90 km/h. Avoid outdoor activities.', issued: '2h ago', expires: '6h', severity: 'severe' },
  { id: 2, type: 'rain', city: 'Tokyo', title: 'High Wave Advisory', description: 'Coastal areas expected to see wave heights of 3–4m due to offshore low pressure. Avoid ocean activities until Sunday.', issued: '5h ago', expires: '24h', severity: 'moderate' },
  { id: 3, type: 'frost', city: 'Toronto', title: 'Frost Advisory', description: 'Overnight temperatures dropping to -2°C. Protect sensitive plants and cover outdoor pipes.', issued: '1h ago', expires: '12h', severity: 'watch' },
  { id: 4, type: 'uv', city: 'Dubai', title: 'Extreme UV Warning', description: 'UV index reaching 11+ between 10 AM and 3 PM. Wear SPF 50+ sunscreen, sunglasses, and protective clothing.', issued: '30m ago', expires: '8h', severity: 'extreme' },
  { id: 5, type: 'wind', city: 'Sydney', title: 'Strong Wind Warning', description: 'Northerly winds 50–70 km/h with gusts to 90 km/h expected along coastal and elevated areas.', issued: '3h ago', expires: '18h', severity: 'moderate' },
]

const SEVERITY_BADGE = {
  extreme: { label: 'Extreme', color: '#9333ea', bg: 'rgba(147,51,234,0.15)' },
  severe: { label: 'Severe', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  moderate: { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  watch: { label: 'Watch', color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)' },
}

export default function Alerts() {
  const [dismissed, setDismissed] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)
  const unit = useSelector((s) => s.settings.unit)

  const activeAlerts = MOCK_ALERTS.filter((a) => !dismissed.has(a.id))
  const filteredAlerts = filter === 'all' ? activeAlerts : activeAlerts.filter((a) => a.type === filter)

  // Dynamic alerts based on real data
  const dynamicAlerts = dashboardCities
    .filter((c) => weatherCities[c]?.current)
    .flatMap((city) => {
      const current = weatherCities[city].current
      const alerts = []
      const temp = current.main.temp
      const windSpeed = (current.wind.speed || 0) * 3.6
      const humidity = current.main.humidity

      if (temp > 38) alerts.push({ id: `heat-${city}`, type: 'uv', city, title: `Extreme Heat — ${city}`, description: `Temperature has reached ${displayTemp(temp, unit)}°${unit}. Stay hydrated and avoid prolonged sun exposure.`, issued: 'Just now', expires: '6h', severity: 'severe', dynamic: true })
      if (temp < 0) alerts.push({ id: `freeze-${city}`, type: 'frost', city, title: `Freezing Warning — ${city}`, description: `Temperature is ${displayTemp(temp, unit)}°${unit}. Black ice possible on roads.`, issued: 'Just now', expires: '12h', severity: 'moderate', dynamic: true })
      if (windSpeed > 60) alerts.push({ id: `wind-${city}`, type: 'wind', city, title: `Strong Wind Alert — ${city}`, description: `Wind speeds reaching ${Math.round(windSpeed)} km/h. Secure outdoor objects.`, issued: 'Just now', expires: '6h', severity: 'moderate', dynamic: true })
      if (humidity < 20) alerts.push({ id: `dry-${city}`, type: 'uv', city, title: `Low Humidity Warning — ${city}`, description: `Humidity at ${humidity}%. Fire risk elevated. Stay hydrated.`, issued: 'Just now', expires: '8h', severity: 'watch', dynamic: true })
      return alerts
    })

  const allAlerts = [...dynamicAlerts, ...filteredAlerts]

  return (
    <div style={{ flex: 1, padding: '28px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700 }}>Weather Alerts</div>
          <div style={{ color: '#8b9ab8', fontSize: '14px', marginTop: '4px' }}>
            {allAlerts.length} active alert{allAlerts.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'storm', 'wind', 'rain', 'frost', 'uv'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
                cursor: 'pointer', border: '1px solid',
                borderColor: filter === f ? '#4f8ef7' : 'rgba(99,140,255,0.12)',
                background: filter === f ? 'rgba(79,142,247,0.15)' : '#151f30',
                color: filter === f ? '#4f8ef7' : '#8b9ab8',
                fontFamily: 'DM Sans, sans-serif',
                textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? 'All' : (ALERT_TYPES[f]?.icon + ' ' + f)}
            </button>
          ))}
        </div>
      </div>

      {allAlerts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#5a6a85' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', color: '#e8edf5', marginBottom: '8px' }}>All Clear!</div>
          <div style={{ fontSize: '14px' }}>No active weather alerts at this time.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {allAlerts.map((alert) => {
          const type = ALERT_TYPES[alert.type] || ALERT_TYPES.wind
          const sev = SEVERITY_BADGE[alert.severity] || SEVERITY_BADGE.watch
          return (
            <div
              key={alert.id}
              className="animate-fade-in"
              style={{
                background: type.bg,
                border: `1px solid ${type.border}`,
                borderRadius: '16px', padding: '20px',
                display: 'flex', gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: '32px', flexShrink: 0, marginTop: '2px' }}>{type.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#e8edf5' }}>{alert.title}</div>
                  <span
                    style={{
                      fontSize: '11px', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '6px',
                      background: sev.bg, color: sev.color,
                    }}
                  >
                    {sev.label}
                  </span>
                  {alert.dynamic && (
                    <span style={{ fontSize: '10px', background: 'rgba(56,217,169,0.15)', color: '#38d9a9', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ color: '#8b9ab8', fontSize: '14px', lineHeight: '1.5', marginBottom: '10px' }}>
                  {alert.description}
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#5a6a85', flexWrap: 'wrap' }}>
                  <span>📍 {alert.city}</span>
                  <span>🕐 Issued {alert.issued}</span>
                  <span>⏰ Expires in {alert.expires}</span>
                </div>
              </div>
              <button
                onClick={() => setDismissed(new Set([...dismissed, alert.id]))}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#5a6a85', fontSize: '18px', flexShrink: 0,
                  padding: '4px', borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5a6a85'}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
