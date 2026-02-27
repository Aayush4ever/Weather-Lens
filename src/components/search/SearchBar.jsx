import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { searchCities } from '../../api/geocodingApi'
import { addDashboardCity } from '../../features/weather/weatherSlice'
import { addFavorite } from '../../features/favorites/favoritesSlice'
import { fetchCityWeather } from '../../features/weather/weatherThunks'

export default function SearchBar({ onCityAdded }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceTimer = useRef(null)

  const doSearch = useCallback(async (q) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await searchCities(q, 6)
      setResults(res)
      setOpen(res.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => doSearch(val), 350)
  }

  const handleSelect = (city) => {
    dispatch(addDashboardCity(city.name))
    dispatch(addFavorite(city.name))
    dispatch(fetchCityWeather(city.name))
    setQuery('')
    setResults([])
    setOpen(false)
    if (onCityAdded) onCityAdded(city.name)
  }

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const flagEmojis = {
    US: '🇺🇸', GB: '🇬🇧', JP: '🇯🇵', AU: '🇦🇺', CA: '🇨🇦', IN: '🇮🇳',
    DE: '🇩🇪', FR: '🇫🇷', BR: '🇧🇷', AE: '🇦🇪', SG: '🇸🇬', CN: '🇨🇳',
    KR: '🇰🇷', RU: '🇷🇺', MX: '🇲🇽', IT: '🇮🇹', ES: '🇪🇸', NL: '🇳🇱',
    ZA: '🇿🇦', NG: '🇳🇬', EG: '🇪🇬', AR: '🇦🇷', PK: '🇵🇰', ID: '🇮🇩',
  }

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
      <div style={{ position: 'relative' }}>
        <svg
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6a85', pointerEvents: 'none' }}
          width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search city..."
          style={{
            width: '100%',
            padding: '9px 36px 9px 40px',
            background: '#151f30',
            border: '1px solid rgba(99,140,255,0.12)',
            borderRadius: '40px',
            color: '#e8edf5',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#4f8ef7'
            e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.15)'
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.borderColor = 'rgba(99,140,255,0.12)'
              e.target.style.boxShadow = 'none'
            }
          }}
          onFocusCapture={(e) => {
            e.target.style.borderColor = '#4f8ef7'
            e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.15)'
          }}
          onBlurCapture={(e) => {
            e.target.style.borderColor = 'rgba(99,140,255,0.12)'
            e.target.style.boxShadow = 'none'
          }}
        />
        {loading && (
          <svg
            className="animate-spin-slow"
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f8ef7' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="animate-fade-down"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#1a2540',
            border: '1px solid rgba(99,140,255,0.22)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: 500,
          }}
        >
          {results.map((city, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelect(city)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: i < results.length - 1 ? '1px solid rgba(99,140,255,0.07)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#151f30'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>{flagEmojis[city.country] || '🌍'}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#e8edf5' }}>{city.name}</div>
                <div style={{ fontSize: '12px', color: '#5a6a85' }}>{city.displayName}</div>
              </div>
              <svg
                style={{ marginLeft: 'auto', color: '#5a6a85' }}
                width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
