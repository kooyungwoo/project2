import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/pages/sample/error'


export const Route = createFileRoute('/page/sample/error/')({
  staticData: { title: '에러 샘플 페이지' },
  component: IndexPage,
})
