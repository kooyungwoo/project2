export function setSessionItem(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`sessionStorage set 실패: ${key}`, err)
  }
}

export function getSessionItem(key) {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (err) {
    console.error(`sessionStorage get 실패: ${key}`, err)
    return null
  }
}

export function removeSessionItem(key) {
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    console.error(`sessionStorage remove 실패: ${key}`, err)
  }
}