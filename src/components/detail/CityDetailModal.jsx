import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearActiveCity } from '../../features/weather/weatherSlice'
import { toggleFavorite } from '../../features/favorites/favoritesSlice'
import { getWeatherIcon, getWindDirection } from '../../utils/weatherIcons'
import { displayTemp } from '../../utils/tempUtils'
import { getLocalTime } from '../../utils/dateUtils'
import HourlyForecast from './HourlyForecast'
import DailyForecast from './DailyForecast'
import DetailStats from './DetailStats'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatHour } from '../../utils/dateUtils'

export default function CityDetailModal({ showToast }) {
  const dispatch = useDispatch()
  const activeCityName = useSelector((s) => s.weather.activeCityName)
  const cityData = useSelector((s) => activeCityName ? s.weather.cities[activeCityName] : null)
  const unit = useSelector((s) => s.settings.unit)
  const isFav = useSelector((s) => activeCityName ? s.favorites.cities.includes(activeCityName) : false)

  const isOpen = !!activeCityName && !!cityData

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') dispatch(clearActiveCity()) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])

  if (!isOpen) return null

  const { current, hourly } = cityData
  if (!current) return null

  const icon = getWeatherIcon(current.weather[0].icon)
  const windDir = getWindDirection(current.wind.deg || 0)
  const localTime = getLocalTime(current.timezone || 0)

  // Build 24h temp chart
  const chartData = (hourly || []).slice(0, 12).map((h) => ({
    time: formatHour(h.dt),
    temp: Math.round(h.temp),
  }))

  const handleFav = () => {
    dispatch(toggleFavorite(activeCityName))
    showToast(
      isFav ? `${activeCityName} removed from favorites` : `${activeCityName} added to favorites ⭐`,
      isFav ? 'info' : 'success'
    )
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '40px 20px',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dispatch(clearActiveCity()) }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: '#0d1421',
          border: '1px solid rgba(99,140,255,0.22)',
          borderRadius: '20px',
          width: '100%', maxWidth: '860px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '24px 28px',
            borderBottom: '1px solid rgba(99,140,255,0.1)',
            background: `linear-gradient(135deg, ${icon.bg}, transparent)`,
            borderRadius: '20px 20px 0 0',
          }}
        >
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700 }}>
              {activeCityName}
            </div>
            <div style={{ color: '#5a6a85', fontSize: '14px', marginTop: '2px' }}>
              {current.sys?.country} · Local time {localTime}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleFav}
              style={{
                background: isFav ? 'rgba(245,158,11,0.15)' : '#151f30',
                border: `1px solid ${isFav ? 'rgba(245,158,11,0.4)' : 'rgba(99,140,255,0.12)'}`,
                borderRadius: '10px',
                width: '38px', height: '38px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: isFav ? '#f59e0b' : '#8b9ab8',
                transition: 'all 0.2s',
              }}
            >
              <svg width="16" height="16" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
            <button
              onClick={() => dispatch(clearActiveCity())}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: '#151f30',
                border: '1px solid rgba(99,140,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#8b9ab8', fontSize: '18px',
                transition: 'all 0.2s',
              }}
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '72px', filter: `drop-shadow(0 0 20px ${icon.accent}60)` }}>
              {icon.emoji}
            </span>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '72px', fontWeight: 800, lineHeight: 1 }}>
                {displayTemp(current.main.temp, unit)}
                <sup style={{ fontSize: '32px', color: '#8b9ab8', fontWeight: 400 }}>°{unit}</sup>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 500, color: '#e8edf5', textTransform: 'capitalize' }}>
                {current.weather[0].description}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginLeft: 'auto' }}>
              {[
                ['💧', 'Humidity', `${current.main.humidity}%`],
                ['💨', 'Wind', `${Math.round(current.wind.speed * 3.6)} km/h ${windDir}`],
                ['🌡️', 'Feels Like', `${displayTemp(current.main.feels_like, unit)}°${unit}`],
                ['📊', 'Pressure', `${current.main.pressure} hPa`],
              ].map(([ico, lbl, val]) => (
                <div
                  key={lbl}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', color: '#8b9ab8',
                    background: '#151f30',
                    padding: '8px 12px', borderRadius: '10px',
                    border: '1px solid rgba(99,140,255,0.1)',
                  }}
                >
                  {ico} {lbl}: <strong style={{ color: '#e8edf5' }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Hourly */}
          <Section title="Hour-by-Hour Forecast">
            <HourlyForecast cityName={activeCityName} />
          </Section>

          {/* Section: 7 Day */}
          <Section title="7-Day Forecast">
            <DailyForecast cityName={activeCityName} />
          </Section>

          {/* Section: Temperature Chart */}
          {chartData.length > 0 && (
            <Section title="Temperature Trend (Next 36h)">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: '#5a6a85', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#5a6a85', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${displayTemp(v, unit)}°`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1a2540', border: '1px solid rgba(99,140,255,0.22)', borderRadius: '10px', fontSize: '13px' }}
                    formatter={(v) => [`${displayTemp(v, unit)}°${unit}`, 'Temperature']}
                  />
                  <Area
                    type="monotone" dataKey="temp" stroke="#4f8ef7" strokeWidth={2.5}
                    fill="url(#modalGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#4f8ef7', stroke: '#0d1421', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* Section: Detailed Stats */}
          <Section title="Detailed Statistics">
            <DetailStats cityName={activeCityName} />
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          fontSize: '12px', fontWeight: 700, letterSpacing: '1.2px',
          textTransform: 'uppercase', color: '#5a6a85',
          marginBottom: '12px',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
