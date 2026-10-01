import '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    /** 브라우저 탭(및 KeepAlive 탭)에 표시할 화면 제목 */
    title?: string
  }
}
