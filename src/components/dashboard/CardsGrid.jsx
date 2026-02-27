import React from 'react'
import { useSelector } from 'react-redux'
import CityCard from './CityCard'

export default function CardsGrid({ onOpenDetail, showToast }) {
  const dashboardCities = useSelector((s) => s.weather.dashboardCities)
  const compact = useSelector((s) => s.settings.compactCards)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact
          ? 'repeat(auto-fill, minmax(220px, 1fr))'
          : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {dashboardCities.map((city) => (
        <CityCard
          key={city}
          cityName={city}
          onOpenDetail={onOpenDetail}
          showToast={showToast}
        />
      ))}
    </div>
  )
}
