import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/page/sample/file'


export const Route = createFileRoute('/page/sample/file/')({
  component: IndexPage,
})
