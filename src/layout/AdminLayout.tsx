import { useState, useEffect, type ComponentType, type ReactNode } from 'react'
import { useLocation, useRouter } from '@tanstack/react-router'
import Header from '@/layout/parts/Header'
import Sidebar from '@/layout/parts/Sidebar'
import Footer from '@/layout/parts/Footer'
import { TabHeader, openTabsAtom, tabActionsAtom } from '@/features/tabs'
import { useSetAtom, useAtomValue } from 'jotai'
import KeepAlive from 'react-activation'
import { useCommonCode } from '@/features/common-code'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dispatch = useSetAtom(tabActionsAtom)
  const location = useLocation()
  const openTabs = useAtomValue(openTabsAtom)
  const router = useRouter() // 라우터 인스턴스

  // 공통코드 초기화, 예시: 더미 그룹 코드 로드
  useCommonCode('dumyGroup')

  /**
   * 경로에 매칭되는 페이지 컴포넌트를 공식 API로 조회합니다.
   * - router.matchRoutes(path): 해당 경로의 매칭 정보(공식 공개 메서드)
   * - router.looseRoutesById: routeId로 라우트 정의를 조회하는 공개 접근자
   * (기존 router.routesByPath / match.route 내부 구조 의존 제거)
   */
  const getComponentByPath = (path: string): ReactNode => {
    try {
      const matches = router.matchRoutes(path)
      // 마지막 매칭이 해당 경로의 최종(리프) 라우트 정보입니다.
      const lastMatch = matches.at(-1)

      if (!lastMatch) {
        return <div className="p-4 text-gray-400">경로를 매칭할 수 없습니다.</div>
      }

      const route = router.looseRoutesById[lastMatch.routeId]
      const Component = route?.options?.component as ComponentType | undefined

      if (Component) {
        return <Component />
      }

      console.warn(`컴포넌트를 찾지 못한 경로: ${path}`, lastMatch)

      return <div className="p-4 border border-dashed text-gray-400">
        [{path}] 컴포넌트 정의를 찾을 수 없습니다.
      </div>
    } catch (error) {
      console.error(`컴포넌트 로드 중 오류 발생: ${path}`, error)
      return <div className="p-4 text-red-400">컴포넌트 로드 오류</div>
    }
  }

  // 경로가 바뀔 때마다 openTabsAtom 상태를 확인하고, 없으면 추가
  useEffect(() => {
    // 현재 경로가 openTabs에 없으면 추가
    const isExist = openTabs.some(tab => tab.path === location.pathname)

    // 탭이 존재하지 않으면 추가 액션 디스패치
    if (!isExist) {
      // 현재 경로에 매칭되는 라우트의 staticData에서 제목을 가져옴(없으면 경로 마지막 세그먼트)
      const matches = router.matchRoutes(location.pathname)
      const lastMatch = matches.at(-1)
      const title = lastMatch?.staticData?.title
        || location.pathname.split('/').filter(Boolean).pop()
        || '메인'

      dispatch({
        type: 'ADD_TAB', // 탭 추가 액션
        payload: {
          title: title,
          path: location.pathname, // 고유 식별자
          id: location.pathname // KeepAlive용 id도 동일하게 설정
        }
      })
    }
  }, [location.pathname, openTabs, dispatch, router])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <TabHeader />
          <main className="flex-1 p-6 bg-white dark:bg-gray-900 relative overflow-hidden">
            {openTabs.map((tab) => (
              <div
                key={tab.path}
                className={location.pathname === tab.path ? 'h-full w-full' : 'hidden'}
              >
                <KeepAlive id={tab.path} name={tab.path}>
                  {/* 수동 매핑 대신 동적 함수 호출 */}
                  {getComponentByPath(tab.path)}
                </KeepAlive>
              </div>
            ))}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
