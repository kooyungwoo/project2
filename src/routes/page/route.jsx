import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/layout/AdminLayout'

export const Route = createFileRoute('/page')({
  component: Layout,
})
