import { atom } from 'jotai'

export interface CommonCode {
  commonGroupCd: string
  commonValue: string
  commonName: string
}

export const commonCodeAtom = atom<CommonCode[]>([])
