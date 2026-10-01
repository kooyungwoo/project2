import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 전역 로딩 오버레이 표시 여부(기본값 true) */
    globalLoading?: boolean
    /** 전역 에러 다이얼로그 표시 여부(기본값 true) */
    handleErrorGlobally?: boolean
  }
}
