import React from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

function getUVColor(uv) {
  if (uv <= 2) return '#22c55e'
  if (uv <= 5) return '#f59e0b'
  if (uv <= 7) return '#f97316'
  if (uv <= 10) return '#ef4444'
  return '#9333ea'
}

export default function UVIndexChart() {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)

  const data = dashboardCities
    .filter((c) => weatherCities[c]?.current)
    .map((c) => ({
      city: c.length > 8 ? c.slice(0, 8) : c,
      uv: weatherCities[c].current?.uvi ?? 0,
    }))

  if (data.length === 0) {
    return (
      <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a85' }}>
        Loading...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" vertical={false} />
        <XAxis
          dataKey="city"
          tick={{ fill: '#5a6a85', fontSize: 10, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5a6a85', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false} tickLine={false}
          domain={[0, 12]}
        />
        <Tooltip
          contentStyle={{
            background: '#1a2540',
            border: '1px solid rgba(99,140,255,0.22)',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#e8edf5',
          }}
          formatter={(v) => [v, 'UV Index']}
        />
        <Bar dataKey="uv" radius={[5, 5, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={getUVColor(d.uv)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
