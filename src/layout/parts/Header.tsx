import { Button } from "@/components/ui/button"
import PropTypes from "prop-types"
import { useTheme } from "@/hooks/use-theme"
import { Moon, Sun } from "lucide-react"

export default function Header({ sidebarOpen, setSidebarOpen }) {
    const { theme, setTheme } = useTheme();

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <header className="h-14 bg-gray-800 dark:bg-gray-950 text-white flex items-center px-4">
            {/* 모바일 햄버거 버튼 */}
            <Button
                variant="outline"
                size="sm"
                className="md:hidden mr-2 text-black dark:text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                ☰
            </Button>
            
            <div className="font-bold text-lg">관리자 대시보드</div>
            
            <div className="ml-auto flex gap-2">
                {/* 테마 토글 버튼 */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleDarkMode} 
                    className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                >
                    {theme === "dark" ? (
                        <><Sun className="mr-2 h-4 w-4" /> 라이트 모드</>
                    ) : (
                        <><Moon className="mr-2 h-4 w-4" /> 다크 모드</>
                    )}
                </Button>
                
                <Button variant="outline" size="sm" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                    로그아웃
                </Button>
            </div>
        </header>      
    )
}

Header.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
}