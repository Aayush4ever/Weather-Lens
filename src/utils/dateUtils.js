import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns'

export function formatTime(unixTimestamp, timezone = 0) {
  const date = fromUnixTime(unixTimestamp)
  return format(date, 'h:mm a')
}

export function formatDate(unixTimestamp) {
  const date = fromUnixTime(unixTimestamp)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE, MMM d')
}

export function formatDayShort(unixTimestamp) {
  const date = fromUnixTime(unixTimestamp)
  if (isToday(date)) return 'Today'
  return format(date, 'EEE')
}

export function formatHour(unixTimestamp) {
  const date = fromUnixTime(unixTimestamp)
  return format(date, 'h a')
}

export function formatFullDate(unixTimestamp) {
  const date = fromUnixTime(unixTimestamp)
  return format(date, 'MMMM d, yyyy')
}

export function formatLastUpdated(timestamp) {
  if (!timestamp) return 'Never'
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 10) return 'Just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function getLocalTime(timezone) {
  const now = new Date()
  const utcOffset = now.getTimezoneOffset() * 60
  const localTime = new Date((now.getTime() / 1000 + utcOffset + timezone) * 1000)
  return format(localTime, 'h:mm a')
}
