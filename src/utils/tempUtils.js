export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32)
}

export function fahrenheitToCelsius(f) {
  return Math.round(((f - 32) * 5) / 9)
}

export function formatTemp(celsius, unit) {
  if (unit === 'F') return `${celsiusToFahrenheit(celsius)}°F`
  return `${Math.round(celsius)}°C`
}

export function formatTempNum(celsius, unit) {
  if (unit === 'F') return celsiusToFahrenheit(celsius)
  return Math.round(celsius)
}

export function formatTempUnit(unit) {
  return unit === 'F' ? '°F' : '°C'
}

export function formatTempSymbol(unit) {
  return unit === 'F' ? '°F' : '°C'
}

export function displayTemp(value, unit) {
  const rounded = Math.round(value)
  if (unit === 'F') return celsiusToFahrenheit(rounded)
  return rounded
}
