import { useAtom } from "jotai"
import { alertMessageAtom } from "@/atoms/alertAtom"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { AlertTriangle } from "lucide-react" // 주의/경고 아이콘

export function GlobalAlertDialog() {
  const [alertMessage, setAlertMessage] = useAtom(alertMessageAtom)

  return (
    <AlertDialog open={!!alertMessage} onOpenChange={() => setAlertMessage(null)}>
      {/* 테두리에 연한 황색 포인트를 주어 차별화 */}
      <AlertDialogContent className="max-w-[400px] border-amber-100">
        <AlertDialogHeader className="flex flex-col items-center justify-center gap-4 py-4">
          
          {/* 상단 주의 아이콘 섹션 (황색 배경) */}
          <div className="rounded-full bg-amber-50 p-3">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
          
          <AlertDialogTitle className="text-xl font-semibold text-amber-700">
            경고
          </AlertDialogTitle>
          
          <div className="text-center text-sm text-slate-600 leading-relaxed px-2">
            {/* 메시지 줄바꿈 유지 */}
            <p className="whitespace-pre-wrap">{alertMessage}</p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            onClick={() => setAlertMessage(null)}
            className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-24 border-none"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}