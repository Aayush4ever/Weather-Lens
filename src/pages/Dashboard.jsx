import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCitiesWeather } from '../features/weather/weatherThunks'
import { setActiveCity } from '../features/weather/weatherSlice'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import CardsGrid from '../components/dashboard/CardsGrid'
import TemperatureChart from '../components/charts/TemperatureChart'
import PrecipitationChart from '../components/charts/PrecipitationChart'
import WindCompass from '../components/charts/WindCompass'
import DailyForecast from '../components/detail/DailyForecast'

export default function Dashboard({ showToast }) {
  const dispatch = useDispatch()
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)
  const { countdown, triggerRefresh } = useAutoRefresh()
  const [chartTab, setChartTab] = useState('hourly')

  // Initial fetch on mount
  useEffect(() => {
    dispatch(fetchAllCitiesWeather())
  }, [dispatch])

  const handleRefresh = () => {
    triggerRefresh()
    showToast('Refreshing all cities...', 'info')
  }

  const handleOpenDetail = (city) => {
    dispatch(setActiveCity(city))
  }

  // For wind compass, use first loaded city
  const firstLoadedCity = dashboardCities.find((c) => weatherCities[c]?.current)
  const windData = firstLoadedCity ? weatherCities[firstLoadedCity].current : null

  const totalCities = dashboardCities.length
  const loadedCities = dashboardCities.filter((c) => weatherCities[c]?.current).length

  return (
    <div style={{ flex: 1, padding: '28px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700, lineHeight: 1.2 }}>
            Weather Dashboard
          </div>
          <div style={{ color: '#8b9ab8', fontSize: '14px', marginTop: '4px' }}>
            {loadedCities}/{totalCities} cities loaded · Next refresh in {countdown}s
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Live indicator */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px',
              background: 'rgba(56,217,169,0.1)',
              border: '1px solid rgba(56,217,169,0.25)',
              borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#38d9a9',
            }}
          >
            <div className="animate-pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38d9a9', boxShadow: '0 0 8px #38d9a9' }} />
            Live
          </div>
          <button
            onClick={handleRefresh}
            style={{
              padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', border: 'none',
              background: '#4f8ef7', color: '#fff',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#3d7de8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#4f8ef7'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh All
          </button>
        </div>
      </div>

      {/* City Cards Grid */}
      <CardsGrid onOpenDetail={handleOpenDetail} showToast={showToast} />

      {/* Temperature Trends Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700 }}>
          Temperature Trends
        </div>
        <div
          style={{
            display: 'flex', gap: '4px',
            background: '#151f30',
            border: '1px solid rgba(99,140,255,0.12)',
            borderRadius: '10px', padding: '4px',
          }}
        >
          {[['hourly', 'Hourly'], ['daily', 'Daily']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setChartTab(key)}
              style={{
                padding: '6px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', border: 'none',
                background: chartTab === key ? '#4f8ef7' : 'transparent',
                color: chartTab === key ? '#fff' : '#8b9ab8',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Temperature Chart */}
        <div style={{ background: '#151f30', border: '1px solid rgba(99,140,255,0.12)', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
            Multi-City Temperatures
          </div>
          <div style={{ color: '#5a6a85', fontSize: '12px', marginBottom: '16px' }}>
            Comparing temperatures across cities
          </div>
          <TemperatureChart mode={chartTab} />
        </div>

        {/* Precipitation Chart */}
        <div style={{ background: '#151f30', border: '1px solid rgba(99,140,255,0.12)', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
            Precipitation
          </div>
          <div style={{ color: '#5a6a85', fontSize: '12px', marginBottom: '16px' }}>
            7-day rain probability
          </div>
          <PrecipitationChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* 7-Day Forecast */}
        <div style={{ background: '#151f30', border: '1px solid rgba(99,140,255,0.12)', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
            7-Day Forecast
          </div>
          <div style={{ color: '#5a6a85', fontSize: '12px', marginBottom: '16px' }}>
            {firstLoadedCity || '—'} · Click a day for details
          </div>
          {firstLoadedCity
            ? <DailyForecast cityName={firstLoadedCity} />
            : <div style={{ color: '#5a6a85', fontSize: '13px' }}>Loading forecast...</div>
          }
        </div>

        {/* Wind Compass */}
        <div style={{ background: '#151f30', border: '1px solid rgba(99,140,255,0.12)', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>
            Wind Analysis
          </div>
          <div style={{ color: '#5a6a85', fontSize: '12px', marginBottom: '16px' }}>
            {firstLoadedCity || '—'} · Current conditions
          </div>
          {windData ? (
            <WindCompass
              windDeg={windData.wind?.deg ?? 0}
              windSpeed={windData.wind?.speed ?? 0}
              gustSpeed={windData.wind?.gust ?? 0}
              visibility={windData.visibility ?? 0}
            />
          ) : (
            <div style={{ color: '#5a6a85', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
              Loading wind data...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
