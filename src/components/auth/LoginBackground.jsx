import React from "react"

const PARTICLES = [
  { emoji: "☁️", top: "12%", left: "8%", size: "28px", delay: "0s", duration: "6s" },
  { emoji: "⚡", top: "20%", right: "10%", size: "22px", delay: "1s", duration: "7s" },
  { emoji: "🌤️", top: "60%", left: "5%", size: "32px", delay: "2s", duration: "8s" },
  { emoji: "❄️", top: "75%", right: "8%", size: "20px", delay: "0.5s", duration: "5s" },
  { emoji: "🌙", top: "40%", right: "6%", size: "24px", delay: "3s", duration: "9s" },
  { emoji: "💨", bottom: "20%", left: "10%", size: "20px", delay: "1.5s", duration: "7s" },
  { emoji: "🌡️", top: "85%", right: "15%", size: "18px", delay: "2.5s", duration: "6s" },
]

const STAT_CARDS = [
  {
    side: "left",
    top: "30%",
    icon: "🌤️",
    city: "Patna",
    temp: "22°C",
    condition: "Partly Cloudy",
    sub: "Humidity 58%",
  },
  {
    side: "left",
    top: "55%",
    icon: "☀️",
    city: "New Delhi",
    temp: "38°C",
    condition: "Hot & Sunny",
    sub: "UV Index 11",
  },
  {
    side: "right",
    top: "30%",
    icon: "🌸",
    city: "Mumbai",
    temp: "26°C",
    condition: "Warm & Humid",
    sub: "Humidity 72%",
  },
  {
    side: "right",
    top: "55%",
    icon: "🌧️",
    city: "Chennai",
    temp: "14°C",
    condition: "Light Rain",
    sub: "Wind 24 km/h",
  },
]

export default function LoginBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-18px) rotate(8deg); opacity: 0.7; }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); opacity: 0.5; }
          50% { transform: translateY(-10px); opacity: 0.8; }
        }
        @keyframes grid-shimmer {
          0% { opacity: 0.03; }
          50% { opacity: 0.07; }
          100% { opacity: 0.03; }
        }
      `}</style>

      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(79,142,247,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,142,247,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          animation: "grid-shimmer 4s ease-in-out infinite",
        }}
      />

\      <div
        style={{
          position: "absolute",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(79,142,247,0.14) 0%, transparent 70%)",
          top: "-150px", right: "-100px",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "450px", height: "450px",
          background: "radial-gradient(circle, rgba(56,217,169,0.1) 0%, transparent 70%)",
          bottom: "-150px", left: "-120px",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          top: "40%", left: "30%",
          borderRadius: "50%",
        }}
      />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            fontSize: p.size,
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            animation: `float ${p.duration} ease-in-out ${p.delay} infinite`,
            filter: "blur(0.5px)",
            userSelect: "none",
          }}
        >
          {p.emoji}
        </div>
      ))}

      {STAT_CARDS.map((card, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: card.top,
            left: card.side === "left" ? "4%" : undefined,
            right: card.side === "right" ? "4%" : undefined,
            background: "rgba(21,31,48,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(99,140,255,0.15)",
            borderRadius: "14px",
            padding: "14px 16px",
            minWidth: "170px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: `float-card ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "22px" }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8edf5", fontFamily: "Syne, sans-serif" }}>
                {card.city}
              </div>
              <div style={{ fontSize: "10px", color: "#5a6a85" }}>{card.condition}</div>
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#4f8ef7", fontFamily: "Syne, sans-serif" }}>
            {card.temp}
          </div>
          <div style={{ fontSize: "11px", color: "#5a6a85", marginTop: "2px" }}>{card.sub}</div>
        </div>
      ))}
    </div>
  )
}