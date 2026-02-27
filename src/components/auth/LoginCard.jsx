import React from "react"
import GoogleIcon from "./GoogleIcon"
import WeatherLensLogo from "./WeatherLensLogo"

const FEATURES = [
  { icon: "🌍", text: "Real-time weather for 100+ cities" },
  { icon: "📊", text: "Interactive charts & analytics" },
  { icon: "⭐", text: "Favorites synced across devices" },
]

export default function LoginCard({ onLogin, loading, error }) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(79,142,247,0.18)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        animation: "slide-up 0.4s ease",
      }}
    >
      {/* Top liine */}
      <div
        style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #4f8ef7, #38d9a9, transparent)",
          borderRadius: "1px",
        }}
      />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <WeatherLensLogo size="lg" />
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#e8edf5",
            marginBottom: "8px",
          }}
        >
          Welcome back
        </h2>
        <p style={{ fontSize: "14px", color: "#8b9ab8", lineHeight: 1.5 }}>
          Sign in to access your personalized<br />weather dashboard
        </p>
      </div>

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "28px",
          padding: "16px",
          background: "rgba(79,142,247,0.06)",
          border: "1px solid rgba(79,142,247,0.1)",
          borderRadius: "14px",
        }}
      >
        {FEATURES.map(({ icon, text }) => (
          <div
            key={text}
            style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#8b9ab8" }}
          >
            <span style={{ fontSize: "15px" }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "rgba(99,140,255,0.12)" }} />
        <span style={{ fontSize: "11px", color: "#5a6a85", fontWeight: 500, letterSpacing: "0.5px" }}>
          CONTINUE WITH
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(99,140,255,0.12)" }} />
      </div>

      {/* Google Sign-In Button */}
      <button
        onClick={onLogin}
        disabled={loading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "14px 20px",
          background: loading
            ? "rgba(79,142,247,0.5)"
            : "linear-gradient(135deg, #4f8ef7 0%, #3d7de8 100%)",
          border: "1px solid rgba(79,142,247,0.3)",
          borderRadius: "14px",
          color: "#fff",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "DM Sans, sans-serif",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.25s ease",
          boxShadow: "0 8px 30px rgba(79,142,247,0.35)",
          letterSpacing: "0.1px",
          opacity: loading ? 0.8 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 14px 40px rgba(79,142,247,0.5)"
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(79,142,247,0.35)"
        }}
        onMouseDown={(e) => {
          if (!loading) e.currentTarget.style.transform = "translateY(0) scale(0.98)"
        }}
        onMouseUp={(e) => {
          if (!loading) e.currentTarget.style.transform = "translateY(-2px)"
        }}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin-slow"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <GoogleIcon size={22} />
            <span>Sign in with Google</span>
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div
          className="animate-fade-down"
          style={{
            marginTop: "14px",
            padding: "10px 14px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#fca5a5",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Footer */}
      <p
        style={{
          fontSize: "11px",
          color: "#5a6a85",
          textAlign: "center",
          marginTop: "20px",
          lineHeight: 1.6,
        }}
      >
        🔒 Secure authentication via Google OAuth 2.0
        <br />
        We never store your password.
      </p>
    </div>
  )
}