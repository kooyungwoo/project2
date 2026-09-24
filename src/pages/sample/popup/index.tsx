import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function PopupPage() {
  return (
    <Dialog>
      {/* asChild 사용: 내가 넣은 Button을 그대로 트리거로 사용 */}
      <DialogTrigger asChild>
        <Button>팝업 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폼 입력</DialogTitle>
          <DialogDescription>데이터를 입력하거나 수정하세요</DialogDescription>
        </DialogHeader>

        {/* 여기에 form 들어감 */}
        
        <DialogFooter>
          <Button type="submit">저장</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
                닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PopupPage