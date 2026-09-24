import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/pages/sample/popup'


export const Route = createFileRoute('/page/sample/popup/')({
  staticData: { title: '팝업 샘플 페이지' },
  component: IndexPage,
})
