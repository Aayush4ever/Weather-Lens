import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts'
import { displayTemp } from '../../utils/tempUtils'
import { formatHour, formatDayShort } from '../../utils/dateUtils'

const COLORS = ['#4f8ef7', '#38d9a9', '#f59e0b', '#ef4444', '#a78bfa', '#fb923c']

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#1a2540',
        border: '1px solid rgba(99,140,255,0.22)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        fontSize: '13px',
      }}
    >
      <div style={{ color: '#8b9ab8', marginBottom: '6px', fontSize: '11px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600, marginBottom: '2px' }}>
          {p.name}: {displayTemp(p.value, unit)}°{unit}
        </div>
      ))}
    </div>
  )
}

export default function TemperatureChart({ mode = 'hourly' }) {
  const weatherCities = useSelector((s) => s.weather.cities)
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const unit = useSelector((s) => s.settings.unit)
  const [hiddenLines, setHiddenLines] = useState(new Set())

  // Build chart data
  const activeCities = dashboardCities
    .filter((c) => weatherCities[c]?.current)
    .slice(0, 4)

  let chartData = []

  if (mode === 'hourly') {
    // Use hourly data from first city to build time axis
    const firstCity = activeCities[0]
    const hourlyData = weatherCities[firstCity]?.hourly || []

    if (hourlyData.length > 0) {
      chartData = hourlyData.slice(0, 12).map((h) => {
        const point = { time: formatHour(h.dt) }
        activeCities.forEach((city) => {
          const cityHourly = weatherCities[city]?.hourly || []
          const match = cityHourly.find((item) => item.dt === h.dt)
          if (match) point[city] = Math.round(match.temp)
        })
        return point
      })
    }
  } else if (mode === 'daily') {
    const firstCity = activeCities[0]
    const dailyData = weatherCities[firstCity]?.daily || []

    chartData = dailyData.map((d) => {
      const point = { time: formatDayShort(d.dt) }
      activeCities.forEach((city) => {
        const cityDaily = weatherCities[city]?.daily || []
        const match = cityDaily.find((item) => item.dt === d.dt)
        if (match) {
          point[`${city}_hi`] = Math.round(match.temp_max)
          point[`${city}_lo`] = Math.round(match.temp_min)
        }
      })
      return point
    })
  }

  if (chartData.length === 0) {
    return (
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a85' }}>
        Loading chart data...
      </div>
    )
  }

  const toggleLine = (city) => {
    const next = new Set(hiddenLines)
    if (next.has(city)) next.delete(city)
    else next.add(city)
    setHiddenLines(next)
  }

  return (
    <div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {activeCities.map((city, i) => (
          <button
            key={city}
            onClick={() => toggleLine(city)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0,
              opacity: hiddenLines.has(city) ? 0.4 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <div style={{ width: '12px', height: '3px', borderRadius: '2px', background: COLORS[i] }} />
            <span style={{ fontSize: '12px', color: '#8b9ab8', fontFamily: 'DM Sans, sans-serif' }}>{city}</span>
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
          <defs>
            {activeCities.map((city, i) => (
              <linearGradient key={city} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `${displayTemp(v, unit)}°`}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          {activeCities.map((city, i) => (
            !hiddenLines.has(city) && (
              <Area
                key={city}
                type="monotone"
                dataKey={city}
                stroke={COLORS[i]}
                strokeWidth={2.5}
                fill={`url(#grad-${i})`}
                dot={false}
                activeDot={{ r: 5, fill: COLORS[i], stroke: '#0d1421', strokeWidth: 2 }}
              />
            )
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
