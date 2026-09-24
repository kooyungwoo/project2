import { useSetAtom } from 'jotai'
import { openTabsAtom } from '@/atoms/tabAtom'
import { useAliveController } from 'react-activation'

export function useTabActions() {
  const setOpenTabs = useSetAtom(openTabsAtom)
  const { drop } = useAliveController() // 캐시 제어 도구

  const closeTab = (path) => {
    // 상태에서 제거
    setOpenTabs((prev) => prev.filter((tab) => tab.path !== path))
    
    // KeepAlive 메모리 캐시에서 해당 경로 삭제
    drop(path) 
  }

  return { closeTab }
}