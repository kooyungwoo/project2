import { useState } from "react"
import { Button } from "@/components/ui/button"
import PropTypes from "prop-types"


/* Header 컴포넌트, jsx 파일이고 1개만 export하기 때문에 default사용 */
export default function Header({ sidebarOpen, setSidebarOpen }) {
    const [darkMode, setDarkMode] = useState(false);

    // 다크 모드 토글
    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        if (darkMode) {
            document.documentElement.classList.remove("dark")
        } else {
            document.documentElement.classList.add("dark")        
        }
    }
    return (
        <header className="h-14 bg-gray-800 dark:bg-gray-950 text-white flex items-center px-4">
            {/* 모바일 햄버거 버튼 */}
            <Button
            variant="outline"
            size="sm"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            >
            ☰
            </Button>
            <div className="font-bold text-lg">관리자 대시보드</div>
            <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleDarkMode} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                {darkMode ? "라이트 모드" : "다크 모드"}
            </Button>
            <Button variant="outline" size="sm" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">로그아웃</Button>
            </div>
        </header>      
    )
}

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
}
