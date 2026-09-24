import { useSetAtom } from 'jotai'
import { confirmAtom } from '@/atoms/confirmAtom'

export interface ConfirmOptions {
  title?: string
  message?: string
  variant?: string
}

export function useConfirm() {
  /* confirm 출력 메시지 설정 */
  const setConfirm = useSetAtom(confirmAtom)

  const confirm = ({ title = '확인', message = '', variant = 'default' }: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirm({
        isOpen: true,
        title,
        message,
        variant,
        resolve, // 여기서 프로미스의 resolve를 넘겨줌
      })
    })
  }

  return confirm
}
