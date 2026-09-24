import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/page/sample/popup'


export const Route = createFileRoute('/page/sample/popup/')({
  component: IndexPage,
})
