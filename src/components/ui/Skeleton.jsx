import React from 'react'

function Skeleton({ width = '100%', height = '16px', rounded = '6px', className = '' }) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, #151f30 25%, #1a2540 50%, #151f30 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )
}

export function CityCardSkeleton() {
  return (
    <div
      style={{
        background: '#151f30',
        border: '1px solid rgba(99,140,255,0.12)',
        borderRadius: '18px',
        padding: '22px',
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="flex justify-between mb-3">
        <div>
          <Skeleton width="120px" height="18px" rounded="6px" />
          <div style={{ marginTop: '6px' }}>
            <Skeleton width="80px" height="12px" rounded="4px" />
          </div>
        </div>
        <Skeleton width="48px" height="48px" rounded="12px" />
      </div>
      <Skeleton width="90px" height="42px" rounded="8px" />
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="110px" height="12px" rounded="4px" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton width="64px" height="28px" rounded="20px" />
        <Skeleton width="72px" height="28px" rounded="20px" />
        <Skeleton width="56px" height="28px" rounded="20px" />
      </div>
    </div>
  )
}

export default Skeleton
