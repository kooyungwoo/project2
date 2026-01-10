import { useQuery } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import ErrorBoundary from '@/components/ErrorBoundary'

/* 공통 쿼리 훅(react-query 사용) */
export function useCommonQuery(queryKey, queryFn, options = {}) {
  const defaultOptions = {
    staleTime: 1000 * 60, /* 데이터가 “신선”하다고 간주되는 시간 */
    retry: 1, /* 실패 시 재시도 횟수 */
    refetchOnWindowFocus: false, /* 윈도우 포커스 시 자동 재조회 여부 */
    refetchOnReconnect: true, /* 네트워크 재연결 시 자동 재조회 여부 */
    cacheTime: 1000 * 60 * 5, /* 캐시 유지 시간 */
    enabled: true, /* 쿼리 활성화 여부 */
  }

  /* 병합된 옵션(defaultOptions:기본옵션 <- options:사용용자정의옵션 덮어쓰기) */
  const mergedOptions = { ...defaultOptions, ...options }

  const { data, isLoading, error, refetch  } = useQuery({
    queryKey,
    queryFn,
    ...mergedOptions,
  })

  /* 로딩 및 에러 처리(로딩 및 에러 UI 반환) */
  if (isLoading) return { ui: <Loading /> }
  if (error) {
    return { 
      ui: <ErrorBoundary error={error} />, // error 객체 주입
      data: null
    };
  }

  /* 쿼리 결과 반환(ui: 정상이라 아무것도 없음, data: 쿼리 결과, refetch: 재조회 함수) */
  return { ui: null, data, refetch }
}