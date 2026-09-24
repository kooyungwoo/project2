import { atom } from 'jotai'

export interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  variant: string
  resolve: ((value: boolean) => void) | null // Promise의 resolve 함수를 보관
}

export const confirmAtom = atom<ConfirmState>({
  isOpen: false,
  title: '확인',
  message: '',
  variant: 'default',
  resolve: null,
})
