import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/page/sample/form'


export const Route = createFileRoute('/page/sample/form/')({
  component: IndexPage,
})
