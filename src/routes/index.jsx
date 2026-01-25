import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-4">
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <Link to="/page/sample/grid">그리드 샘플 페이지</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <Link to="/page/sample/form">폼 샘플 페이지</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <Link to="/page/sample/popup">팝업 샘플 페이지</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
      >
        <Link to="/page/sample/file">파일 샘플 페이지</Link>
      </Button>
    </div>
  ),
})