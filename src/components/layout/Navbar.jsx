import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUnit } from '../../features/settings/settingsSlice'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../search/SearchBar'

export default function Navbar({ onToggleSettings, onCityAdded, showToast }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unit = useSelector((s) => s.settings.unit)
  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    navigate('/login')
    if (showToast) showToast('Signed out successfully', 'info')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: '64px',
        background: 'rgba(6,10,18,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,140,255,0.12)',
        gap: '16px',
      }}
    >
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        onClick={() => window.location.hash = '/'}
      >
        <div
          className="animate-pulse-dot"
          style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#38d9a9',
            boxShadow: '0 0 10px #38d9a9',
          }}
        />
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            color: '#e8edf5',
            letterSpacing: '-0.3px',
          }}
        >
          Weather<span style={{ color: '#4f8ef7' }}>Lens</span>
        </span>
      </div>

      {/* Search */}
      <SearchBar onCityAdded={(city) => {
        if (showToast) showToast(`${city} added to dashboard! 🌍`, 'success')
        if (onCityAdded) onCityAdded(city)
      }} />

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Unit Toggle */}
        <div
          style={{
            display: 'flex',
            background: '#151f30',
            border: '1px solid rgba(99,140,255,0.12)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {['C', 'F'].map((u) => (
            <button
              key={u}
              onClick={() => {
                dispatch(setUnit(u))
                if (showToast) showToast(`Switched to ${u === 'C' ? 'Celsius' : 'Fahrenheit'}`, 'info')
              }}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: unit === u ? '#4f8ef7' : 'transparent',
                color: unit === u ? '#fff' : '#8b9ab8',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              °{u}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: '#151f30',
              border: '1px solid rgba(99,140,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#8b9ab8',
              transition: 'all 0.2s',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div
              style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#ef4444',
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #060a12',
                color: '#fff',
              }}
            >2</div>
          </button>
          {showNotif && (
            <div
              className="animate-fade-down"
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#1a2540',
                border: '1px solid rgba(99,140,255,0.22)',
                borderRadius: '12px', width: '280px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                zIndex: 200,
                overflow: 'hidden',
              }}
            >
              {[
                { icon: '⛈️', title: 'Storm Warning — New York', time: '2h ago', color: 'rgba(239,68,68,0.12)' },
                { icon: '🌊', title: 'High Waves — Tokyo', time: '5h ago', color: 'rgba(245,158,11,0.1)' },
              ].map((n, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px', display: 'flex', gap: '12px',
                    borderBottom: i === 0 ? '1px solid rgba(99,140,255,0.08)' : 'none',
                    background: n.color, cursor: 'pointer',
                  }}
                  onClick={() => setShowNotif(false)}
                >
                  <span style={{ fontSize: '22px' }}>{n.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf5' }}>{n.title}</div>
                    <div style={{ fontSize: '11px', color: '#5a6a85', marginTop: '2px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={onToggleSettings}
          style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: '#151f30',
            border: '1px solid rgba(99,140,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#8b9ab8',
            transition: 'all 0.2s',
          }}
          title="Settings"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* User Avatar with dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: user?.photoURL
                ? 'transparent'
                : 'linear-gradient(135deg, #4f8ef7, #38d9a9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              border: '2px solid rgba(99,140,255,0.22)',
              color: '#fff',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
            title={user?.displayName || 'Profile'}
          >
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.displayName?.[0] || 'W')
            }
          </div>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div
              className="animate-fade-down"
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#1a2540',
                border: '1px solid rgba(99,140,255,0.22)',
                borderRadius: '14px', width: '220px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                zIndex: 300, overflow: 'hidden',
              }}
            >
              {/* User info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,140,255,0.1)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf5', marginBottom: '2px' }}>
                  {user?.displayName || 'User'}
                </div>
                <div style={{ fontSize: '11px', color: '#5a6a85', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || ''}
                </div>
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: '#ef4444',
                  fontSize: '13px', fontWeight: 500,
                  textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
