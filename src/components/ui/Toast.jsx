import React from 'react'

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
}

const borders = {
  success: 'rgba(56,217,169,0.3)',
  error: 'rgba(239,68,68,0.3)',
  info: 'rgba(79,142,247,0.3)',
  warning: 'rgba(245,158,11,0.3)',
}

function ToastItem({ toast, onRemove }) {
  return (
    <div
      className="animate-toast-in flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-xl cursor-pointer"
      style={{
        background: '#1a2540',
        border: `1px solid ${borders[toast.type] || borders.info}`,
        color: '#e8edf5',
        maxWidth: '340px',
      }}
      onClick={() => onRemove(toast.id)}
    >
      <span>{icons[toast.type] || '💬'}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
