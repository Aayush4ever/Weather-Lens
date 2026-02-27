import React from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatDayShort } from '../../utils/dateUtils'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#1a2540',
        border: '1px solid rgba(99,140,255,0.22)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
      }}
    >
      <div style={{ color: '#8b9ab8', marginBottom: '4px', fontSize: '11px' }}>{label}</div>
      <div style={{ color: '#4f8ef7', fontWeight: 600 }}>
        Rain chance: {Math.round(payload[0]?.value || 0)}%
      </div>
    </div>
  )
}

export default function PrecipitationChart() {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)

  const firstCity = dashboardCities.find((c) => weatherCities[c]?.daily?.length > 0)
  const daily = firstCity ? weatherCities[firstCity]?.daily || [] : []

  const chartData = daily.slice(0, 7).map((d) => ({
    day: formatDayShort(d.dt),
    pop: d.pop || 0,
  }))

  if (chartData.length === 0) {
    return (
      <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a85', fontSize: '13px' }}>
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
        <defs>
          <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#38d9a9" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pop" fill="url(#precipGrad)" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
