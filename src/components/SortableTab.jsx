import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SortableTab({ tab, isActive, onClick, onClose }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tab.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1, // 드래그 중인 탭이 가장 위로 오도록
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // 드래그 핸들을 탭 전체로 설정 (버튼 제외)
      {...attributes}
      {...listeners}
      onClick={() => onClick(tab.path)}
      className={cn(
        "group relative flex items-center h-8 px-3 min-w-[100px] max-w-[200px] text-sm cursor-pointer border-t-2 transition-all rounded-t-md select-none touch-none",
        isActive
          ? "bg-white dark:bg-gray-900 border-primary text-primary font-semibold shadow-sm"
          : "bg-gray-100 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
      )}
    >
      <span className="truncate mr-2">{tab.title}</span>
      {tab.closable !== false && (
        <button
          // 버튼 클릭 시 드래그가 시작되지 않도록 이벤트 전파 방지
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose(e, tab.path);
          }}
          className="ml-auto p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}