import {
  AlertTriangle,
  AppWindow,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Table2,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '관리자',
    email: 'admin@example.com',
    avatar: '',
  },
  teams: [
    {
      name: 'My Admin',
      logo: LayoutDashboard,
      plan: 'React + Shadcn',
    },
  ],
  navGroups: [
    {
      title: '샘플',
      items: [
        {
          title: '폼 샘플',
          url: '/page/sample/form',
          icon: FileText,
        },
        {
          title: '그리드 샘플',
          url: '/page/sample/grid',
          icon: Table2,
        },
        {
          title: '팝업 샘플',
          url: '/page/sample/popup',
          icon: AppWindow,
        },
        {
          title: '파일 샘플',
          url: '/page/sample/file',
          icon: FolderOpen,
        },
        {
          title: '에러 샘플',
          url: '/page/sample/error',
          icon: AlertTriangle,
        },
      ],
    },
  ],
}
