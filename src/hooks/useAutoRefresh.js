import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCitiesWeather } from '../features/weather/weatherThunks'

const REFRESH_INTERVAL = 60 * 1000 // 60 seconds

/**
 * Auto-refresh all city weather data every 60 seconds.
 * Returns countdown seconds until next refresh.
 */
export function useAutoRefresh() {
  const dispatch = useDispatch()
  const autoRefresh = useSelector((s) => s.settings.autoRefresh)
  const [countdown, setCountdown] = useState(60)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  const triggerRefresh = () => {
    dispatch(fetchAllCitiesWeather())
    setCountdown(60)
  }

  useEffect(() => {
    if (!autoRefresh) {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
      return
    }

    // Main refresh timer
    timerRef.current = setInterval(triggerRefresh, REFRESH_INTERVAL)

    // Countdown timer (every second)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(countdownRef.current)
    }
  }, [autoRefresh, dispatch])

  return { countdown, triggerRefresh }
}
