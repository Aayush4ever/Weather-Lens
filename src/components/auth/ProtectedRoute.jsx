import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060a12",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {/* Spinner */}
        <svg
          className="animate-spin-slow"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="rgba(99,140,255,0.2)" strokeWidth="3" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="#4f8ef7"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "14px",
            color: "#5a6a85",
            letterSpacing: "0.5px",
          }}
        >
          Loading WeatherLens...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}