import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/pages/sample/form'


export const Route = createFileRoute('/page/sample/form/')({
  staticData: { title: '폼 샘플 페이지' },
  component: IndexPage,
})
