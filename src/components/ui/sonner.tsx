import { Toaster as Sonner, type ToasterProps } from 'sonner'
import type { CSSProperties } from 'react'
import { useTheme } from '@/provider/theme'

/**
 * sonner 기반 토스트.
 * 기존 커스텀 토스트(`@/components/ui/toaster`)와 공존하며,
 * 색상/라운드/그림자/폭 등 디자인을 커스텀 토스트에 최대한 맞춘다.
 */
export function Toaster({ ...props }: Readonly<ToasterProps>) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position='bottom-right'
      expand={false}
      richColors={false}
      closeButton
      className='toaster group'
      style={
        {
          /* 기존 토스트와 동일한 색/테두리 토큰 */
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          /* destructive(error)만 색상 적용 — 커스텀 destructive variant와 동일 */
          '--error-bg': 'var(--destructive)',
          '--error-text': '#fff',
          '--error-border': 'var(--destructive)',
          /* 모양/폭도 커스텀과 맞춤 */
          '--border-radius': 'calc(var(--radius) - 2px)',
          '--width': 'min(420px, calc(100vw - 2rem))',
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'gap-1 text-sm shadow-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm opacity-90',
          closeButton:
            'bg-background text-foreground/50 border-border hover:text-foreground',
        },
      }}
      {...props}
    />
  )
}
