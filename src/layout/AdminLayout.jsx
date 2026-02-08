import { useState, useEffect } from "react"
import { useLocation, useRouter } from '@tanstack/react-router' 
import Header from "@/layout/parts/Header"
import Sidebar from "@/layout/parts/SideBar"
import Footer from "@/layout/parts/Footer"
import TabHeader from "@/layout/parts/TabHeader"
import { useSetAtom, useAtomValue } from "jotai"
import { openTabsAtom } from "@/atoms/tabAtom"
import { tabActionsAtom } from "@/atoms/tabActionsAtom" 
import KeepAlive from "react-activation"
import { useCommonCode } from '@/hooks/useCommonCode'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const dispatch = useSetAtom(tabActionsAtom);
    const location = useLocation()
    const openTabs = useAtomValue(openTabsAtom)
    const router = useRouter() // 라우터 인스턴스 가져오기

    // 공통코드 초기화, 예시: 더미 그룹 코드 로드
    useCommonCode('dumyGroup');

    // [중요] 경로에 맞는 컴포넌트를 라우터 설정에서 동적으로 찾는 함수
    const getComponentByPath = (path) => {
        try {
            // 현재 라우터 상태에서 매치된 모든 라우트 정보를 가져옵니다.
            // matchRoutes보다 현재 로드된 matches를 보는 것이 더 정확할 때가 많습니다.
            const matches = router.matchRoutes(path);
            // matches[matches.length - 1] -> matches?.at(-1) 으로 수정
            // 가장 마지막 배열의 값의 값을 가지고 오기 위해 사용, 마지막 값이 현재 경로에 매칭된 최종 라우트 정보이기 때문
            const match = matches?.at(-1);

            if (!match) return <div className="p-4 text-gray-400">경로를 매칭할 수 없습니다.</div>;

            // 컴포넌트가 숨어있을 수 있는 모든 위치를 뒤집니다.
            const Component = router.routesByPath[path]?.options?.component;

            if (Component) {
                // 만약 Component가 함수가 아니라 이미 렌더링된 요소라면 그대로 반환(여기에서 반환되는게 페이지 컴포넌트)
                return typeof Component === 'function' ? <Component /> : Component;
            }

            // 디버깅을 위해 콘솔에 match 구조 출력(컴포넌트 찾지 못함)
            console.warn(`컴포넌트를 찾지 못한 경로: ${path}`, match);
            
            return <div className="p-4 border border-dashed text-gray-400">
                [{path}] 컴포넌트 정의를 찾을 수 없습니다.
            </div>;
        } catch (error) {
            console.error(`컴포넌트 로드 중 오류 발생: ${path}`, error);
            return <div className="p-4 text-red-400">컴포넌트 로드 오류</div>;
        }
    };

    useEffect(() => {
        const isExist = openTabs.some(tab => tab.path === location.pathname);

        if (!isExist) {
            const matches = router.matchRoutes(location.pathname);
            const lastMatch = matches?.at(-1);
            
            // staticData나 title이 없을 경우를 대비한 기본값 처리
            const title = lastMatch?.route?.options?.staticData?.title 
                        || location.pathname.split('/').pop() 
                        || '메인';

            dispatch({ 
                type: 'ADD_TAB', 
                payload: { 
                    title: title,
                    path: location.pathname, 
                    id: location.pathname 
                } 
            });
        }
    }, [location.pathname, openTabs, dispatch, router]);

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen}/>
                <div className="flex-1 flex flex-col min-w-0">
                    <TabHeader /> 
                    <main className="flex-1 p-6 bg-white dark:bg-gray-900 relative overflow-hidden">
                        {openTabs.map((tab) => (
                            <div
                                key={tab.path}
                                className={location.pathname === tab.path ? "h-full w-full" : "hidden"}
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