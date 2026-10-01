import { useCallback, useEffect } from 'react'
import { useAtom, type PrimitiveAtom } from 'jotai'
import { setSessionItem, getSessionItem } from '@/lib/sessionStorage'

/* sessionStorage에 상태를 저장/사용하는 공통 훅(jotai 사용) */
export function usePersistedAtom<T>(atom: PrimitiveAtom<T>, key: string) {
  const [state, setState] = useAtom(atom)

  // 최초 로드시 sessionStorage 값 복원
  useEffect(() => {
    const saved = getSessionItem<T>(key)
    if (saved !== null) {
      setState(saved)
    }
  }, [key, setState])

  // 조회 버튼 클릭 시 호출할 함수
  const saveSessionState = useCallback(() => {
    setSessionItem(key, state)
  }, [key, state])

  return [state, setState, saveSessionState] as const
}
