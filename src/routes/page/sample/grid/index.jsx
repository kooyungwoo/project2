import { createFileRoute } from '@tanstack/react-router'
import IndexPage from '@/page/sample/grid'


export const Route = createFileRoute('/page/sample/grid/')({
  component: IndexPage,
})
