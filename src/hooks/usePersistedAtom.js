import { useCallback } from 'react'
import { useAtom } from 'zotai'
import { useEffect } from 'react'
import { setSessionItem, getSessionItem } from '@/utils/sessionStorage'

/* sessionStorage에 상태를 저장/사용하는 공통 훅(zotai 사용) */
export function usePersistedAtom(atom, key) {
  const [state, setState] = useAtom(atom)

  // 최초 로드시 sessionStorage 값 복원
  useEffect(() => {
    const saved = getSessionItem(key)
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (err) {
        console.error(`sessionStorage parse 실패: ${key}`, err)
      }
    }
  }, [key, setState])

  // 조회 버튼 클릭 시 호출할 함수
  const saveSessionState = useCallback(() => {
      setSessionItem(key, JSON.stringify(state))
    }, [key, state])
  

  return [state, setState, saveSessionState]
}