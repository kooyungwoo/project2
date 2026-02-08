import { atom } from 'jotai'

/**
 * 열려 있는 탭 리스트 관리
 * 객체 구조: { title: string, path: string, id: string, closable: boolean }
 */
export const openTabsAtom = atom([])