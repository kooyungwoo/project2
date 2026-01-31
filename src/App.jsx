import { RouterProvider, createRouter } from '@tanstack/react-router'
// vite-plugin-router가 자동 생성하는 파일
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalOverlay } from "@/components/GlobalOverlay"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const queryClient = new QueryClient()

// 라우터 생성
const router = createRouter({ routeTree })

function App() {
  return (
    <QueryClientProvider client={queryClient}>      
      <RouterProvider router={router} />
      {/* 공통 레이어 (로딩, 에러, 알림, 컨펌) */}
      <GlobalOverlay />

      {/* 개발 도구(npm run dev 상태에서만 보임) */}
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools initialIsOpen={false} />
          <TanStackRouterDevtools router={router} />
        </>
      )}
    </QueryClientProvider>
  )
}

export default App