import { useState, useCallback } from 'react'
import { setSessionItem, getSessionItem } from '@/utils/sessionStorage'

/* sessionStorage에 상태를 저장/사용하는 공통 훅(React useState 사용) */
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    const saved = getSessionItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  const setPersistedState = (newState) => {
    // previous state 기반으로 업데이트
    // prev 기존의 값에 newState 새로운 값 병합
    setState(prev => ({ ...prev, ...newState }))
  }

  // 검색 등 필요시 명시적으로 sessionStorage에 저장
  const saveSessionState = useCallback(() => {
    setSessionItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setPersistedState, saveSessionState]
}