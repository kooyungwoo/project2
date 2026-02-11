import { getDefaultStore } from 'jotai';
import { openTabsAtom } from '@/atoms/tabAtom';
import { alertMessageAtom } from '@/atoms/alertAtom';

const store = getDefaultStore();

/**
 * 새로운 경로로 진입이 가능한지 체크하는 정책 함수
 * @param {string} nextPath - 진입하려는 경로
 * @returns {boolean} - 진입 허용 여부
 */
export const canOpenNextTab = (nextPath) => {
  const currentTabs = store.get(openTabsAtom);
  
  // 이미 열려있는 탭이면 무조건 통과 (탭 전환)
  const isAlreadyOpen = currentTabs.some(tab => tab.path === nextPath);
  if (isAlreadyOpen) return true;

  // 새로운 탭인데 10개가 넘었다면 차단
  if (currentTabs.length >= 10) {
    store.set(alertMessageAtom, "최대 10개까지만 탭을 열 수 있습니다.");
    return false;
  }

  return true;
};