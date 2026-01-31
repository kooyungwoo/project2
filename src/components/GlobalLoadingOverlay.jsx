import { useAtomValue } from "jotai";
import { loadingCountAtom } from "@/atoms/loadingAtom";
import { Loader2 } from "lucide-react"; // shadcn/ui 등에서 사용하는 아이콘

export function GlobalLoadingOverlay() {
    const count = useAtomValue(loadingCountAtom);
    if (count === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-gray-600">처리 중입니다...</p>
      </div>
    </div>
  );
}