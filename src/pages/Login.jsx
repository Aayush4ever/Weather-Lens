import React, { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"
import { useNavigate } from "react-router-dom"
import LoginCard from "../components/auth/LoginCard"
import LoginBackground from "../components/auth/LoginBackground"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      const messages = {
        "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
        "auth/popup-blocked": "Popup was blocked by your browser. Please allow popups for this site.",
        "auth/cancelled-popup-request": "Sign-in was cancelled.",
        "auth/network-request-failed": "Network error. Check your internet connection.",
        "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
      }
      setError(messages[err.code] || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060a12",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      <LoginBackground />

      {/* Login card */}
      <LoginCard onLogin={handleLogin} loading={loading} error={error} />
    </div>
  )
}