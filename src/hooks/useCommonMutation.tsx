import { useMutation, type UseMutationOptions } from '@tanstack/react-query'

/* 공통 뮤테이션(put, post, delete method용) 훅(react-query 사용) */
export function useCommonMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> = {}
) {
  const defaultOptions = {
    retry: 0, // 민감 작업은 재시도 금지
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const { mutate, data, isPending, error } = useMutation<TData, TError, TVariables>({
    mutationFn,
    ...mergedOptions,
  })

  // v4의 isLoading 명칭 호환을 위해 함께 반환(v5에서는 isPending 사용)
  return { isLoading: isPending, isPending, mutate, data, error }
}
