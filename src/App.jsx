import { RouterProvider, createRouter } from '@tanstack/react-router'
// vite-plugin-router가 자동 생성하는 파일
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// 라우터 생성
const router = createRouter({ routeTree })

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App