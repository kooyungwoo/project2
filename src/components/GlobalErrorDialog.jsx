import { useAtom } from "jotai"
import { errorMessageAtom } from "@/atoms/errorAtom"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { XCircle } from "lucide-react" // 에러 아이콘

export function GlobalErrorDialog() {
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom)

  return (
    <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
      <AlertDialogContent className="max-w-[400px] border-red-100">
        <AlertDialogHeader className="flex flex-col items-center justify-center gap-4 py-4">
          {/* 상단 에러 아이콘 섹션 */}
          <div className="rounded-full bg-red-50 p-3">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          
          <AlertDialogTitle className="text-xl font-semibold text-red-600">
            에러 발생
          </AlertDialogTitle>
          
          <div className="text-center text-sm text-slate-600 leading-relaxed px-2">
            {/* 줄바꿈 처리를 위한 white-space-pre-wrap 권장 */}
            <p className="whitespace-pre-wrap">{errorMessage}</p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            onClick={() => setErrorMessage(null)}
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-24"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}