import { useAtom } from "jotai"
import { errorMessageAtom } from "@/atoms/errorAtom"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"

export function GlobalErrorDialog() {
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom)

  /** 
   * !!errorMessage !! -> 값 존재 여부를 boolean으로 변환(있으면 true, 없으면 false)
   * errorMessage || x -> OR 연산자. 앞 값이 falsy('', 0, null, undefined)면 뒤 값(x)을 반환
   * errorMessage ?? x -> Nullish Coalescing 연산자. null이나 undefined일 때만 뒤 값(x)을 반환
    */
  return (
    <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>에러 발생</AlertDialogHeader>
        <p>{errorMessage}</p>
        <AlertDialogFooter>
          <button onClick={() => setErrorMessage(null)}>확인</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}