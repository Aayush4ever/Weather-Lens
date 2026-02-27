import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite } from '../../features/favorites/favoritesSlice'
import { setActiveCity } from '../../features/weather/weatherSlice'
import { getWeatherIcon, getWindDirection } from '../../utils/weatherIcons'
import { displayTemp } from '../../utils/tempUtils'
import { formatLastUpdated } from '../../utils/dateUtils'
import { CityCardSkeleton } from '../ui/Skeleton'

export default function CityCard({ cityName, onOpenDetail, showToast }) {
  const dispatch = useDispatch()
  const cityData = useSelector((s) => s.weather.cities[cityName])
  const isFav = useSelector((s) => s.favorites.cities.includes(cityName))
  const unit = useSelector((s) => s.settings.unit)
  const compact = useSelector((s) => s.settings.compactCards)

  if (!cityData || cityData.loading) return <CityCardSkeleton />
  if (cityData.error) {
    return (
      <div
        style={{
          background: '#151f30',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '18px',
          padding: '22px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          minHeight: '180px',
        }}
      >
        <span style={{ fontSize: '32px' }}>⚠️</span>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#e8edf5' }}>{cityName}</div>
        <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{cityData.error}</div>
      </div>
    )
  }

  const { current, lastFetched } = cityData
  if (!current) return <CityCardSkeleton />

  const iconInfo = getWeatherIcon(current.weather[0].icon)
  const windDir = getWindDirection(current.wind.deg || 0)

  const handleClick = () => {
    dispatch(setActiveCity(cityName))
    if (onOpenDetail) onOpenDetail(cityName)
  }

  const handleFav = (e) => {
    e.stopPropagation()
    dispatch(toggleFavorite(cityName))
    showToast(
      isFav ? `${cityName} removed from favorites` : `${cityName} added to favorites ⭐`,
      isFav ? 'info' : 'success'
    )
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#151f30',
        border: `1px solid ${isFav ? 'rgba(245,158,11,0.25)' : 'rgba(99,140,255,0.12)'}`,
        borderRadius: '18px',
        padding: compact ? '16px' : '22px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
        '--card-glow': iconInfo.bg,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = isFav ? 'rgba(245,158,11,0.4)' : 'rgba(99,140,255,0.3)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = isFav ? 'rgba(245,158,11,0.25)' : 'rgba(99,140,255,0.12)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Glow blob */}
      <div
        style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: `radial-gradient(circle, ${iconInfo.bg} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>{cityName}</div>
          <div style={{ fontSize: '12px', color: '#5a6a85', marginTop: '2px' }}>
            {current.sys?.country || ''}
          </div>
        </div>
        <span style={{ fontSize: compact ? '32px' : '40px', filter: `drop-shadow(0 0 10px ${iconInfo.accent}40)` }}>
          {iconInfo.emoji}
        </span>
      </div>

      {/* Temperature */}
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: compact ? '34px' : '44px', fontWeight: 800, lineHeight: 1 }}>
        {displayTemp(current.main.temp, unit)}
        <sup style={{ fontSize: '18px', color: '#8b9ab8', fontWeight: 400 }}>
          °{unit}
        </sup>
      </div>

      {/* Condition */}
      <div style={{ color: '#8b9ab8', fontSize: '13px', marginTop: '4px', marginBottom: '14px', textTransform: 'capitalize' }}>
        {current.weather[0].description}
      </div>

      {/* Stats chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <StatChip icon="💧" label={`${current.main.humidity}%`} />
        <StatChip icon="💨" label={`${Math.round(current.wind.speed * 3.6)} km/h ${windDir}`} />
        <StatChip icon="👁️" label={`${((current.visibility || 0) / 1000).toFixed(0)}km`} />
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '14px', paddingTop: '12px',
          borderTop: '1px solid rgba(99,140,255,0.08)',
        }}
      >
        <div style={{ fontSize: '11px', color: '#5a6a85' }}>
          Feels {displayTemp(current.main.feels_like, unit)}° · {formatLastUpdated(lastFetched)}
        </div>
        <button
          onClick={handleFav}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: isFav ? '#f59e0b' : '#5a6a85',
            padding: '4px', borderRadius: '6px',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.2s',
          }}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="16" height="16" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function StatChip({ icon, label }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        fontSize: '12px', color: '#8b9ab8',
        background: '#111827',
        padding: '5px 10px', borderRadius: '20px',
      }}
    >
      <span style={{ fontSize: '11px' }}>{icon}</span>
      <span style={{ color: '#8b9ab8', fontWeight: 500 }}>{label}</span>
    </div>
  )
}
