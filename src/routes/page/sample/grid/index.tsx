import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/pages/sample/grid'


export const Route = createFileRoute('/page/sample/grid/')({
  staticData: { title: '그리드 샘플 페이지' },
  component: IndexPage,
})
