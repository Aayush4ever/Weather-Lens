import React from 'react'

export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        background: checked ? '#4f8ef7' : '#1a2540',
        border: '1px solid',
        borderColor: checked ? '#4f8ef7' : 'rgba(99,140,255,0.22)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#fff',
          top: '2px',
          left: checked ? '20px' : '2px',
          transition: 'left 0.2s',
          display: 'block',
        }}
      />
    </button>
  )
}
