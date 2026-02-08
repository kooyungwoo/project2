import { RouterProvider, createRouter } from '@tanstack/react-router'
// vite-plugin-router가 자동 생성하는 파일
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalOverlay } from "@/components/GlobalOverlay"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/provider/theme-provider"
import { canOpenNextTab } from '@/policies/tabPolicy'

const queryClient = new QueryClient()

// 라우터 생성
const router = createRouter({ routeTree })

function App() {
  // 전역 클릭 핸들러: 라우터가 반응하기 전에 먼저 검사(탭 정책 위해)
  const handleGlobalClickCapture = (e) => {
    // 클릭된 요소나 그 부모 중에 <a> 태그(Link)가 있는지 확인
    const anchor = e.target.closest('a');
    if (!anchor) return;

    // 경로 추출 (TanStack Link는 내부적으로 href를 생성합니다)
    const href = anchor.getAttribute('href');

    // 체크가 필요한 경로인지 확인 (메인 제외, 외부 링크 제외)
    if (href?.startsWith('/') && href !== '/') {
      // 정책 체크 (탭 개수 등)
      if (!canOpenNextTab(href)) {
        // 브라우저와 라우터 모두에게 이 클릭은 무효라고 선언
        e.preventDefault();    // 페이지 이동 방지
        e.stopPropagation();   // 라우터의 이벤트 리스너까지 가지 않도록 차단
      }
    }
  };

  return (
    <div onClickCapture={handleGlobalClickCapture}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* 공통 레이어 (로딩, 에러, 알림, 컨펌) */}
          <GlobalOverlay />
          {/* 토스트 알림 */}
          <Toaster />

          {/* 개발 도구(npm run dev 상태에서만 보임) */}
          {import.meta.env.DEV && (
            <>
              <ReactQueryDevtools initialIsOpen={false} />
              <TanStackRouterDevtools router={router} />
            </>
          )}      
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  )
}

export default App