import React from "react"

export default function WeatherLensLogo({ size = "lg" }) {
  const sizes = {
    sm: { dot: 8, font: "16px" },
    lg: { dot: 12, font: "26px" },
    xl: { dot: 14, font: "32px" },
  }
  const s = sizes[size] || sizes.lg

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: s.dot,
          height: s.dot,
          borderRadius: "50%",
          background: "#38d9a9",
          boxShadow: "0 0 16px #38d9a9, 0 0 32px rgba(56,217,169,0.4)",
          animation: "pulse-dot 2s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: s.font,
          color: "#e8edf5",
          letterSpacing: "-0.5px",
          lineHeight: 1,
        }}
      >
        Weather<span style={{ color: "#4f8ef7" }}>Lens</span>
      </span>
    </div>
  )
}