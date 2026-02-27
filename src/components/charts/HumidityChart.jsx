import React from 'react'
import { useSelector } from 'react-redux'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts'

export default function HumidityChart() {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const weatherCities = useSelector((s) => s.weather.cities)

  const data = dashboardCities
    .filter((c) => weatherCities[c]?.current)
    .slice(0, 6)
    .map((c) => ({
      city: c.length > 7 ? c.slice(0, 7) + '.' : c,
      humidity: weatherCities[c].current.main.humidity,
    }))

  if (data.length === 0) {
    return (
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6a85' }}>
        Loading...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(99,140,255,0.12)" />
        <PolarAngleAxis
          dataKey="city"
          tick={{ fill: '#8b9ab8', fontSize: 11, fontFamily: 'DM Sans' }}
        />
        <Radar
          name="Humidity"
          dataKey="humidity"
          stroke="#38d9a9"
          fill="#38d9a9"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: '#1a2540',
            border: '1px solid rgba(99,140,255,0.22)',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#e8edf5',
          }}
          formatter={(v) => [`${v}%`, 'Humidity']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
