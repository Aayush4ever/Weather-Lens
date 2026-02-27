import React from 'react'
import { getWindDirection } from '../../utils/weatherIcons'

export default function WindCompass({ windDeg = 0, windSpeed = 0, gustSpeed = 0, visibility = 0 }) {
  const direction = getWindDirection(windDeg)
  const windKmh = Math.round(windSpeed * 3.6)
  const gustKmh = Math.round(gustSpeed * 3.6)
  const visKm = ((visibility || 0) / 1000).toFixed(1)

  return (
    <div>
      {/* Compass */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        <div
          style={{
            width: '120px', height: '120px', borderRadius: '50%',
            border: '2px solid rgba(99,140,255,0.22)',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(79,142,247,0.04)',
          }}
        >
          {/* Cardinal labels */}
          {[
            { label: 'N', top: '6px', left: '50%', transform: 'translateX(-50%)', color: '#4f8ef7' },
            { label: 'S', bottom: '6px', left: '50%', transform: 'translateX(-50%)', color: '#5a6a85' },
            { label: 'E', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#5a6a85' },
            { label: 'W', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#5a6a85' },
          ].map((p, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                fontSize: '11px', fontWeight: 700,
                color: p.color,
                top: p.top, bottom: p.bottom,
                left: p.left, right: p.right,
                transform: p.transform,
              }}
            >
              {p.label}
            </span>
          ))}

          {/* Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '1px',
                height: i % 3 === 0 ? '10px' : '6px',
                background: i % 3 === 0 ? 'rgba(99,140,255,0.3)' : 'rgba(99,140,255,0.15)',
                top: i % 3 === 0 ? '12px' : '14px',
                left: '50%',
                transformOrigin: '0 46px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* Arrow */}
          <div
            style={{
              width: '4px',
              height: '48px',
              position: 'relative',
              transform: `rotate(${windDeg}deg)`,
              transition: 'transform 1s ease',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            {/* North-pointing (colored) */}
            <div style={{
              width: 0, height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '24px solid #4f8ef7',
              filter: 'drop-shadow(0 0 4px rgba(79,142,247,0.5))',
            }} />
            {/* South-pointing (gray) */}
            <div style={{
              width: 0, height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '20px solid #5a6a85',
            }} />
          </div>

          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#4f8ef7',
              boxShadow: '0 0 8px rgba(79,142,247,0.6)',
            }}
          />
        </div>
      </div>

      {/* Wind stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Speed', value: windKmh, unit: 'km/h' },
          { label: 'Gust', value: gustKmh || windKmh + 5, unit: 'km/h' },
          { label: 'Direction', value: direction, unit: '' },
          { label: 'Visibility', value: visKm, unit: 'km' },
        ].map(({ label, value, unit: u }) => (
          <div
            key={label}
            style={{
              background: '#111827',
              borderRadius: '10px',
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#5a6a85', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
              {value}
              {u && <span style={{ fontSize: '11px', color: '#8b9ab8', fontWeight: 400 }}> {u}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
