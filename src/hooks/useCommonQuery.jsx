import { useQuery } from '@tanstack/react-query'

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

  return { isLoading, data, refetch, error }
}