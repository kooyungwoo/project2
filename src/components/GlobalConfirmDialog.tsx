import { useAtom } from "jotai";
import { confirmAtom } from "@/atoms/confirmAtom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function GlobalConfirmDialog() {
  const [confirm, setConfirm] = useAtom(confirmAtom);

  const handleClose = (result) => {
    if (confirm.resolve) confirm.resolve(result); // true 또는 false 반환
    setConfirm((prev) => ({ ...prev, isOpen: false, resolve: null }));
  };

  return (
    <AlertDialog open={confirm.isOpen} onOpenChange={() => handleClose(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-wrap">
            {confirm.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(false)}>취소</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleClose(true)}
            className={confirm.variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}