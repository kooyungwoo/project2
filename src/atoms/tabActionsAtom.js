import { atom } from 'jotai'
import { openTabsAtom } from './tabAtom'

export const tabActionsAtom = atom(
  null,
  (get, set, action) => {
    // useSetAtom을 지우고, 아래 switch문 안에서 직접 set을 사용합니다.
    const currentTabs = get(openTabsAtom);

    /*
    action.type 종류: 현재 설정된 것 외에 아래 기능들도 추가 가능
    해당 기능들은 정해진 규약이 아닌 자유롭게 확장 가능한 액션 타입
    ADD_TAB: 새로운 탭 추가
    REORDER_TABS: 탭 순서 변경 (드래그 앤 드롭 등)
    CLOSE_TAB: 특정 탭 닫기
    CLOSE_OTHERS: 현재 활성화된 탭을 제외한 모든 탭을 닫음 (작업 중인 화면만 남기고 정리하고 싶을 때)
    CLOSE_ALL: 모든 탭을 닫고 메인(홈)으로 이동 (업무를 완전히 새로 시작하거나 퇴근할 때)
    CLOSE_RIGHT: 현재 선택된 탭의 오른쪽에 있는 탭들만 닫음 (브라우저 탭 관리와 유사한 UX 제공)
    REFRESH_TAB: 특정 탭의 상태를 초기화하고 강제 리로드 (AliveScope 캐시를 날리고 페이지를 새로 고침할 때)
    UPDATE_TAB_TITLE: 특정 탭의 제목을 동적으로 변경 ("상세 페이지 진입 후 ""수정"" → ""수정(작업중)"" 등으로 표시할 때")
    */
    switch (action.type) {
      case 'ADD_TAB': { // 탭추가
        // 탭 개수에 대한 처리는 app 레벨에서 이미 처리되었으므로 여기서는 단순 추가만 수행
        const newTab = action.payload;
        // 중복된 탭이 있으면 추가하지 않음
        if (currentTabs.some(tab => tab.path === newTab.path)) return;        
        
        set(openTabsAtom, [...currentTabs, newTab]);
        break;
      }
      case 'REORDER_TABS': { // 탭순서변경
        // payload로 넘어온 새로운 배열(arrayMove 결과물)을 openTabsAtom에 설정
        set(openTabsAtom, action.payload); 
        break;
      }
      case 'CLOSE_TAB': { // 탭닫기
        const pathToRemove = action.payload;
        const nextTabs = currentTabs.filter(tab => tab.path !== pathToRemove);
        set(openTabsAtom, nextTabs);
        break;
      }
    }
  }
);