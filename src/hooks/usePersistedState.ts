import { useState, useCallback } from 'react'
import { setSessionItem, getSessionItem } from '@/lib/sessionStorage'

/* sessionStorage에 상태를 저장/사용하는 공통 훅(React useState 사용) */
export function usePersistedState<T extends Record<string, unknown>>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => getSessionItem<T>(key) ?? initialValue)

  const setPersistedState = (newState: Partial<T>) => {
    // previous state 기반으로 업데이트
    // prev 기존의 값에 newState 새로운 값 병합
    setState(prev => ({ ...prev, ...newState }))
  }

  // 검색 등 필요시 명시적으로 sessionStorage에 저장
  const saveSessionState = useCallback(() => {
    setSessionItem(key, state)
  }, [key, state])

  return [state, setPersistedState, saveSessionState] as const
}
