import { atomWithStorage } from 'jotai/utils'

/**
 * 열려 있는 탭 리스트 관리
 * 객체 구조: { title: string, path: string, id: string, closable: boolean }
 * 브라우저 새로고침 시에도 유지되도록 sessionStorage 연동
 */
export interface TabItem {
  title: string
  path: string
  id: string
  closable?: boolean
}

export const openTabsAtom = atomWithStorage<TabItem[]>('admin_open_tabs', [])
