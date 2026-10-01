export function setSessionItem(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`sessionStorage set 실패: ${key}`, err)
  }
}

export function getSessionItem<T = unknown>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch (err) {
    console.error(`sessionStorage get 실패: ${key}`, err)
    return null
  }
}

export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    console.error(`sessionStorage remove 실패: ${key}`, err)
  }
}
