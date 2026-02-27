import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell,
} from 'recharts'
import { displayTemp } from '../utils/tempUtils'
import { formatDayShort, formatHour } from '../utils/dateUtils'
import HumidityChart from '../components/charts/HumidityChart'
import UVIndexChart from '../components/charts/UVIndexChart'

const COLORS = ['#4f8ef7', '#38d9a9', '#f59e0b', '#ef4444', '#a78bfa', '#fb923c']

const tooltipStyle = {
  background: '#1a2540',
  border: '1px solid rgba(99,140,255,0.22)',
  borderRadius: '10px',
  fontSize: '13px',
  color: '#e8edf5',
}

export default function Analytics() {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)
  const unit = useSelector((s) => s.settings.unit)
  const [selectedCity, setSelectedCity] = useState(null)

  const loadedCities = dashboardCities.filter((c) => weatherCities[c]?.current)
  const activeCity = selectedCity || loadedCities[0]
  const cityData = activeCity ? weatherCities[activeCity] : null

  // Temperature comparison data (current temps of all cities)
  const tempCompData = loadedCities.map((c, i) => ({
    city: c.length > 8 ? c.slice(0, 8) : c,
    temp: Math.round(weatherCities[c].current.main.temp),
    feels: Math.round(weatherCities[c].current.main.feels_like),
    color: COLORS[i % COLORS.length],
  }))

  // Hourly data for selected city
  const hourlyData = (cityData?.hourly || []).slice(0, 12).map((h) => ({
    time: formatHour(h.dt),
    temp: Math.round(h.temp),
    humidity: h.humidity,
    wind: Math.round(h.wind_speed * 3.6),
    pop: h.pop,
  }))

  // Daily data for selected city
  const dailyData = (cityData?.daily || []).map((d) => ({
    day: formatDayShort(d.dt),
    hi: Math.round(d.temp_max),
    lo: Math.round(d.temp_min),
    pop: d.pop,
    humidity: d.humidity,
    wind: Math.round(d.wind_speed * 3.6),
  }))

  // Wind rose data
  const windRoseData = loadedCities.slice(0, 5).map((c, i) => ({
    city: c.length > 7 ? c.slice(0, 7) : c,
    speed: Math.round((weatherCities[c].current.wind.speed || 0) * 3.6),
  }))

  return (
    <div style={{ flex: 1, padding: '28px 28px', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700 }}>Analytics</div>
          <div style={{ color: '#8b9ab8', fontSize: '14px', marginTop: '4px' }}>
            Deep-dive charts & trends across all cities
          </div>
        </div>
        {/* City selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {loadedCities.map((c, i) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: (activeCity === c) ? COLORS[i % COLORS.length] : 'rgba(99,140,255,0.12)',
                background: (activeCity === c) ? `${COLORS[i % COLORS.length]}20` : '#151f30',
                color: (activeCity === c) ? COLORS[i % COLORS.length] : '#8b9ab8',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loadedCities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#5a6a85' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', marginBottom: '8px', color: '#e8edf5' }}>
            No data yet
          </div>
          <div style={{ fontSize: '14px' }}>Go to Dashboard to load city weather data</div>
        </div>
      )}

      {loadedCities.length > 0 && (
        <>
          {/* Row 1: Temp comparison + Hourly */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <ChartCard title="Current Temperature Comparison" sub="All cities — High vs Feels Like">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tempCompData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
                  <XAxis dataKey="city" tick={{ fill: '#5a6a85', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${displayTemp(v, unit)}°`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${displayTemp(v, unit)}°${unit}`, n]} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#8b9ab8' }} />
                  <Bar dataKey="temp" name="Actual" radius={[4, 4, 0, 0]}>
                    {tempCompData.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                  <Bar dataKey="feels" name="Feels Like" fill="rgba(99,140,255,0.3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={`Hourly Trend — ${activeCity || '—'}`} sub="Temperature & Humidity over 36h">
              {hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={hourlyData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: '#5a6a85', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="temp" tick={{ fill: '#5a6a85', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${displayTemp(v, unit)}°`} />
                    <YAxis yAxisId="hum" orientation="right" tick={{ fill: '#5a6a85', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#8b9ab8' }} />
                    <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#4f8ef7" strokeWidth={2.5} dot={false} name="Temp" />
                    <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="#38d9a9" strokeWidth={2} dot={false} name="Humidity %" />
                  </LineChart>
                </ResponsiveContainer>
              ) : <NoDataPlaceholder />}
            </ChartCard>
          </div>

          {/*  Daily forecast chart + Wind speeds */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <ChartCard title={`7-Day Forecast — ${activeCity || '—'}`} sub="Daily high / low temperature bands">
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <defs>
                      <linearGradient id="hiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="loGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#5a6a85', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5a6a85', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${displayTemp(v, unit)}°`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${displayTemp(v, unit)}°${unit}`, n]} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#8b9ab8' }} />
                    <Area type="monotone" dataKey="hi" stroke="#f59e0b" fill="url(#hiGrad)" strokeWidth={2.5} dot={false} name="High" />
                    <Area type="monotone" dataKey="lo" stroke="#4f8ef7" fill="url(#loGrad)" strokeWidth={2} dot={false} name="Low" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <NoDataPlaceholder />}
            </ChartCard>

            <ChartCard title="Wind Speeds" sub="Current km/h across cities">
              <UVIndexChart />
            </ChartCard>
          </div>

          {/* Row 3: Humidity radar + Precipitation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <ChartCard title="Humidity Radar" sub="Relative humidity comparison">
              <HumidityChart />
            </ChartCard>

            <ChartCard title={`Precipitation Probability — ${activeCity || '—'}`} sub="Daily rain chance %">
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <defs>
                      <linearGradient id="popGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f8ef7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#38d9a9" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#5a6a85', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5a6a85', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Rain Chance']} />
                    <Bar dataKey="pop" fill="url(#popGrad2)" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <NoDataPlaceholder />}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

function ChartCard({ title, sub, children }) {
  return (
    <div style={{ background: '#151f30', border: '1px solid rgba(99,140,255,0.12)', borderRadius: '18px', padding: '22px' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{title}</div>
      <div style={{ color: '#5a6a85', fontSize: '12px', marginBottom: '16px' }}>{sub}</div>
      {children}
    </div>
  )
}

function NoDataPlaceholder() {
  return (
    <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a85', fontSize: '13px' }}>
      Loading data...
    </div>
  )
}
