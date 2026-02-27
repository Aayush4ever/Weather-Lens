const CACHE_TTL = 60 * 1000 // 60 seconds

export function isCacheValid(lastFetched) {
  if (!lastFetched) return false
  return Date.now() - lastFetched < CACHE_TTL
}

export function getCacheAge(lastFetched) {
  if (!lastFetched) return null
  return Math.floor((Date.now() - lastFetched) / 1000)
}

export function getTimeUntilRefresh(lastFetched) {
  if (!lastFetched) return 0
  const age = Date.now() - lastFetched
  const remaining = CACHE_TTL - age
  return Math.max(0, Math.ceil(remaining / 1000))
}
