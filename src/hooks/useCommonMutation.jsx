import { useMutation } from '@tanstack/react-query'
import Loading from '@/components/Loading'
import ErrorBoundary from '@/components/ErrorBoundary'

/* 공통 뮤테이션(put, post, delete method용) 훅(react-query 사용) */
export function useCommonMutation(mutationFn, options = {}) {
  const defaultOptions = {
    retry: 0, // 민감 작업은 재시도 금지
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const { mutate, data, isLoading, error } = useMutation({
    mutationFn,
    ...mergedOptions,
  })

  if (isLoading) return { ui: <Loading /> }
  if (error) return { ui: <ErrorBoundary /> }

  return { ui: null, mutate, data }
}