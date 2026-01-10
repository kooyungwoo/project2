import { Link } from '@tanstack/react-router'

/* Sidebar 컴포넌트, jsx 파일이고 1개만 export하기 때문에 default사용 */
export default function Sidebar({ sidebarOpen }) {
    return (
        <aside
          className={`fixed md:static z-20 top-14 left-0 h-full w-60 bg-gray-100 dark:bg-gray-800 border-r p-4 transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <nav className="space-y-2">
            <Link to="/page/sample/form" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">폼 샘플 페이지</Link>
            <Link to="/page/sample/grid" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">그리드 샘플 페이지</Link>
            <Link to="/page/sample/popup" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">팝업 샘플 페이지</Link>
            <Link to="/page/sample/error" className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">error 샘플 페이지</Link>
          </nav>
        </aside> 
    )
}