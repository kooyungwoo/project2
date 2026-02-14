# 프로젝트 라이브러리 설명 (project2)

## 핵심 프레임워크
- **react / react-dom**  
  React 기반 UI 라이브러리와 DOM 렌더링 엔진. 컴포넌트 단위 개발의 핵심.

- **vite**  
  차세대 프론트엔드 빌드 툴. 빠른 개발 서버와 번들링 제공.

## 상태 관리 & 데이터
- **jotai**  
  원자(atom) 기반의 간단하고 직관적인 상태 관리 라이브러리.
- **@tanstack/react-query**  
  서버 상태 관리 및 데이터 fetching 최적화. 캐싱, 동기화, 자동 리페치 지원.
- **@tanstack/react-query-devtools**  
  React Query 상태를 시각적으로 디버깅할 수 있는 도구.
- **@tanstack/react-router**  
  선언적 라우팅 라이브러리. React Router 대안으로 점점 주목받는 중.
- **@tanstack/router-devtools**  
  라우터 상태 디버깅 도구.
- **@tanstack/router-vite-plugin**  
  Vite 환경에서 TanStack Router를 쉽게 통합할 수 있도록 지원.

## UI 컴포넌트 & 스타일링
- **@radix-ui/react-\***  
  접근성(A11y)에 최적화된 UI 컴포넌트 모듈들 (Dialog, Select, Toast 등).
- **lucide-react**  
  React용 아이콘 라이브러리.
- **tailwindcss / tailwind-merge / tailwindcss-animate**  
  유틸리티 기반 CSS 프레임워크와 클래스 병합, 애니메이션 확장 기능.
- **class-variance-authority / clsx**  
  조건부 클래스 관리 및 Tailwind와 함께 사용되는 유틸리티.

## 폼 & 검증
- **react-hook-form**  
  선언적이고 성능 좋은 폼 관리 라이브러리.
- **@hookform/resolvers**  
  react-hook-form과 Zod 같은 검증 라이브러리 연결.
- **zod**  
  타입 안전한 스키마 기반 데이터 검증 라이브러리.

## Drag & Drop
- **@dnd-kit/core / sortable / utilities**  
  React용 Drag & Drop 구현 라이브러리. 리스트 정렬, 드래그 이벤트 처리 지원.

## 데이터 테이블
- **ag-grid-community / ag-grid-react**  
  고성능 데이터 그리드 컴포넌트. 대규모 데이터 표시 및 필터링, 정렬 지원.

## 네트워크
- **axios**  
  HTTP 클라이언트. API 요청 및 응답 처리.

## 개발 도구 & 품질 관리
- **eslint / eslint-plugin-react-hooks / eslint-plugin-react-refresh**  
  코드 품질 검사 및 React 관련 규칙 제공.
- **@eslint/js / globals**  
  ESLint 설정 및 글로벌 변수 정의.
- **postcss / autoprefixer**  
  CSS 후처리 및 브라우저 호환성 자동 처리.
- **@vitejs/plugin-react**  
  Vite에서 React를 지원하기 위한 공식 플러그인.
- **@types/react / @types/react-dom**  
  TypeScript용 React 타입 정의.

---

## 요약
이 프로젝트는 **Vite + React 19** 기반으로,  
- **Radix UI + Tailwind**로 UI 구성  
- **TanStack Query/Router + Jotai**로 상태 및 데이터 관리  
- **React Hook Form + Zod**로 폼 검증  
- **Ag-Grid**로 데이터 테이블 처리  
- **Dnd-kit**으로 Drag & Drop 기능 구현  
하는 구조입니다.