import { useAtomValue, useSetAtom } from "jotai";
import { openTabsAtom } from "@/atoms/tabAtom";
import { tabActionsAtom } from "@/atoms/tabActionsAtom";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAliveController } from "react-activation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTab } from "@/components/SortableTab";


export default function TabHeader() {
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { drop } = useAliveController();

  const openTabs = useAtomValue(openTabsAtom);
  const dispatch = useSetAtom(tabActionsAtom);

  // DnD 센서 설정 (클릭과 드래그 구분)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // 5px 이상 움직여야 드래그로 인식 (단순 클릭 보호)
    })
  );
  // 드래그 종료 핸들러
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = openTabs.findIndex((t) => t.path === active.id);
      const newIndex = openTabs.findIndex((t) => t.path === over.id);
      
      // 탭 순서 변경 액션 호출 (tabActionsAtom의 REORDER_TABS 실행)
      dispatch({ 
        type: "REORDER_TABS", 
        payload: arrayMove(openTabs, oldIndex, newIndex) 
      });
    }
  };
  // 탭 클릭 핸들러(탭 선택 시 경로 전달 및 이동)
  const handleTabClick = (path) => navigate({ to: path });
  // 탭 닫기 핸들러
  const handleCloseTab = (e, path) => {
      // 닫기 버튼 클릭 시 이벤트 전파 방지
      e.stopPropagation();
      // 닫힌 탭이 현재 활성화된 탭인지 확인
      const tabIndex = openTabs.findIndex(t => t.path === path);
      // KeepAlive에서 해당 탭의 캐시 제거
      // AdminLayout에서 ADD_TAB 액션 호출시 id값으로 path를 사용 해당 키로 삭제
      drop(path);
      // 탭 닫기 액션 호출
      dispatch({ type: "CLOSE_TAB", payload: path });
      // 닫힌 탭이 현재 활성화된 탭이면 인접한 탭으로 이동
      if (location.pathname === path) {
          const remainingTabs = openTabs.filter(t => t.path !== path);
          if (remainingTabs.length > 0) {
              const nextTab = remainingTabs[tabIndex] || remainingTabs[tabIndex - 1];
              navigate({ to: nextTab.path });
          } else {
              // 더 이상 열려있는 탭이 없으면 기본 경로로 이동
              navigate({ to: "/" });
          }
      }
  };

  return (
    <div className="flex items-center border-b bg-gray-50 dark:bg-gray-950 px-2 h-10 group">
      <button onClick={() => scroll("left")} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div ref={scrollRef} className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth gap-1 px-1">
        {/* DnD 컨텍스트 적용 */}
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={openTabs.map(t => t.path)} 
            strategy={horizontalListSortingStrategy}
          >
            {openTabs.map((tab) => (
              <SortableTab
                key={tab.path}
                tab={tab}
                isActive={location.pathname === tab.path}
                onClick={handleTabClick}
                onClose={handleCloseTab}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <button onClick={() => scroll("right")} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}