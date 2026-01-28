import { useState, useEffect } from "react"
import { Outlet } from '@tanstack/react-router'
import Header from "@/layout/parts/Header"
import Sidebar from "@/layout/parts/SideBar"
import Footer from "@/layout/parts/Footer"
import { Toaster } from "@/components/ui/toaster"
import { useSetAtom } from "jotai"
import { commonCodeAtom } from "@/atoms/commonCodeAtom"
import { useCommonQuery } from "@/hooks/useCommonQuery"
import { apiClient } from "@/lib/apiClient"
import PropTypes from "prop-types"

/* { children } -> props 객체를 구조분해해서 children만 꺼내 쓰는 함수 매개변수 구조분해 */
/* Layout(props) 이렇게 받을수도 있음, 이 경우 props.children 으로 사용 */
export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const setCommonCode = useSetAtom(commonCodeAtom)

    // 공통코드 조회 (커스텀 훅 사용)
    const { data } = useCommonQuery(
        ["common-code"],
        () => apiClient.get("/common/common-codes").then(res => res.data),
        {
        staleTime: 1000 * 60 * 10, // 10분 동안 fresh
        }
    )
    // 데이터가 변경될 때마다 commonCodeAtom 업데이트(useCommonQuery의 data가 변경될 때마다 실행)
    useEffect(() => {
        if (data) {
        setCommonCode(data)
        }
    }, [data, setCommonCode])

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="flex flex-1">
                <Sidebar sidebarOpen={sidebarOpen}/>
                <main className="flex-1 p-6 bg-white dark:bg-gray-900 overflow-y-auto">
                {/* 기본은 Outlet children 은 만약의 상황을 위해 추가 */}
                {children ?? <Outlet />}
                </main>
            </div>
            <Footer />
            <Toaster />
        </div>
    )
}

Layout.propTypes = {
  children: PropTypes.node,
}
