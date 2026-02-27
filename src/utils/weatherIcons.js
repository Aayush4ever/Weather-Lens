// Maps OpenWeatherMap icon codes to emoji and readable labels
export const iconMap = {
  '01d': { emoji: '☀️', label: 'Clear Sky', bg: 'rgba(251,146,60,0.12)', accent: '#f59e0b' },
  '01n': { emoji: '🌙', label: 'Clear Night', bg: 'rgba(99,140,255,0.1)', accent: '#7eb8ff' },
  '02d': { emoji: '🌤️', label: 'Few Clouds', bg: 'rgba(79,142,247,0.12)', accent: '#4f8ef7' },
  '02n': { emoji: '🌤️', label: 'Few Clouds', bg: 'rgba(79,142,247,0.1)', accent: '#4f8ef7' },
  '03d': { emoji: '⛅', label: 'Scattered Clouds', bg: 'rgba(99,140,255,0.1)', accent: '#7eb8ff' },
  '03n': { emoji: '⛅', label: 'Scattered Clouds', bg: 'rgba(99,140,255,0.1)', accent: '#7eb8ff' },
  '04d': { emoji: '☁️', label: 'Broken Clouds', bg: 'rgba(107,114,128,0.15)', accent: '#9ca3af' },
  '04n': { emoji: '☁️', label: 'Overcast', bg: 'rgba(107,114,128,0.15)', accent: '#9ca3af' },
  '09d': { emoji: '🌦️', label: 'Shower Rain', bg: 'rgba(56,217,169,0.1)', accent: '#38d9a9' },
  '09n': { emoji: '🌦️', label: 'Shower Rain', bg: 'rgba(56,217,169,0.1)', accent: '#38d9a9' },
  '10d': { emoji: '🌧️', label: 'Rain', bg: 'rgba(79,142,247,0.12)', accent: '#4f8ef7' },
  '10n': { emoji: '🌧️', label: 'Rain', bg: 'rgba(79,142,247,0.12)', accent: '#4f8ef7' },
  '11d': { emoji: '⛈️', label: 'Thunderstorm', bg: 'rgba(239,68,68,0.1)', accent: '#ef4444' },
  '11n': { emoji: '⛈️', label: 'Thunderstorm', bg: 'rgba(239,68,68,0.1)', accent: '#ef4444' },
  '13d': { emoji: '❄️', label: 'Snow', bg: 'rgba(147,197,253,0.12)', accent: '#93c5fd' },
  '13n': { emoji: '❄️', label: 'Snow', bg: 'rgba(147,197,253,0.12)', accent: '#93c5fd' },
  '50d': { emoji: '🌫️', label: 'Mist', bg: 'rgba(156,163,175,0.12)', accent: '#9ca3af' },
  '50n': { emoji: '🌫️', label: 'Mist', bg: 'rgba(156,163,175,0.12)', accent: '#9ca3af' },
}

export function getWeatherIcon(iconCode) {
  return iconMap[iconCode] || { emoji: '🌡️', label: 'Unknown', bg: 'rgba(99,140,255,0.1)', accent: '#4f8ef7' }
}

export function getUVLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' }
  if (uv <= 5) return { label: 'Moderate', color: '#f59e0b' }
  if (uv <= 7) return { label: 'High', color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' }
  return { label: 'Extreme', color: '#9333ea' }
}

export function getWindDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

export function getAQILabel(aqi) {
  const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
  const colors = ['', '#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#9333ea']
  return { label: labels[aqi] || 'Unknown', color: colors[aqi] || '#9ca3af' }
}
