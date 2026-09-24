import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/pages/sample/file'


export const Route = createFileRoute('/page/sample/file/')({
  staticData: { title: '파일 샘플 페이지' },
  component: IndexPage,
})
