# AGENTS.md

> 이 파일은 AI 에이전트(및 협업자)가 이 저장소에서 작업할 때 지켜야 할 규칙과 프로젝트 맥락을 정리한 것입니다.
> 상세 이력은 `docs/development-notes.md`, 요약은 `docs/development-notes-summary.md` 참고.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 **CMS 관리자 템플릿**.
TanStack Router(파일 기반) + TanStack Query + Jotai + axios, shadcn/ui + Tailwind CSS v4 사용.
탭 + KeepAlive(`react-activation`) 관리자 레이아웃과 공통코드/검색/그리드 샘플 페이지를 포함한다.

## 명령어

```bash
npm run dev            # 개발 서버
npm run build          # tsc --noEmit && vite build
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint (sonarjs 포함)
npm run lint:style     # stylelint
npm run lint:all       # lint + lint:style + typecheck
```

- **변경 후 필수**: `npm run lint:all` 후 `npm run build`까지 통과 확인.
- 테스트 프레임워크는 아직 없음(도입 시 이 문서 갱신).

## 기술 스택

| 영역 | 사용 |
| --- | --- |
| 코어 | React 19, TypeScript, Vite 7 |
| 라우팅 | TanStack Router (파일 기반, `@tanstack/router-vite-plugin`) |
| 서버 상태 | TanStack Query v5 + axios (`src/lib/apiClient.ts`) |
| 전역 UI 상태 | Jotai (`src/atoms/`) |
| 폼/검증 | react-hook-form + zod v4 |
| UI | shadcn/ui (`new-york`/`slate`), Tailwind v4, lucide-react, sonner |
| 기타 | ag-grid(그리드), dnd-kit(탭 정렬), react-activation(탭 KeepAlive), react-to-print |

## 폴더 구조

```
src/
  features/     도메인별 co-locate (tabs, common-code ...) + barrel index.ts
  hooks/        공용 인프라 훅만 (useCommonQuery/Mutation, useConfirm, useToast ...)
  layout/       AdminLayout + app-sidebar/header/nav-* + data/sidebar-data.ts
  pages/        화면 컴포넌트 (sample/*)
  routes/       TanStack 파일 라우트 (URL). routeTree.gen.ts는 자동 생성
  components/   공통 컴포넌트 + ui/(shadcn)
  provider/     theme/ , layout/
  lib/          apiClient, utils(cn), sessionStorage, cookies
  atoms/        Jotai 전역 UI 상태
  styles/       index.css(Tailwind v4 진입), theme.css(디자인 토큰)
  types/        d.ts 모듈 증강
```

## 작업 규칙

- **커밋/푸시는 명시적으로 요청받았을 때만** 수행한다.
- import alias는 `@/*` → `src/*` (tsconfig `paths`). 상대경로보다 alias를 우선한다.
- **자동 생성 파일 `src/routeTree.gen.ts`는 직접 편집하지 않는다.**
- 도메인 로직은 관련 상태·훅·컴포넌트를 `src/features/<도메인>/`에 함께 두고 `index.ts`로 export한다.
  `src/hooks/`에는 특정 도메인에 종속되지 않은 공용 인프라 훅만 둔다.
- 라우트(`src/routes/`, URL)와 화면(`src/pages/`, 컴포넌트)을 분리한다. `src/routes/page/`는 `/page` URL용 폴더로 `src/pages/`와 역할이 다르다.
- 파일/훅 네이밍은 camelCase, 컴포넌트는 PascalCase.
- 주석·UI 문구·커밋 메시지는 한국어를 사용한다.
- 작업요청, 수정요청이 있을때만 파일 수정을 진행한다. 명확한 작업,수정 요청이 없는 경우 작업전 확인 후 작업을 진행한다.

### UI / 스타일
- shadcn 컴포넌트는 새로 만들기 전에 `src/components/ui`의 기존 컴포넌트를 재사용한다.
  신규 추가는 `npx shadcn@latest add <component>` (components.json: `new-york`/`slate`).
- **Tailwind v4 CSS-first**: `tailwind.config.js`는 없다. 디자인 토큰은 `src/styles/theme.css`(`@theme inline`)와 `src/styles/index.css`에서 관리한다. 유틸 클래스는 그대로 사용 가능.
- 주의: 기존 `components/ui`의 일부는 구세대(shadcn v3 시절, `forwardRef`) 스타일이라 v4 유틸 차이가 있을 수 있다. 새 컴포넌트/수정 시 신세대 패턴(`data-slot`, `React.ComponentProps`, `outline-hidden`, `shadow-xs`)으로 맞춘다.

### 폼 / 데이터
- 폼은 react-hook-form + zod. `<Form {...form}>` 래핑 필수, 검증 시점은 조회/제출 시점(`mode: 'onSubmit'`).
- 값 변환(문자 → 숫자/날짜)은 UI가 아니라 `services/`에서 처리한다.
- 공통코드 select는 `codeGroup`만 받아 `useCommonCode`(=`@/features/common-code`)로 옵션을 자동 구성한다.

### 알림 / 오류 처리 정책 (중요)
기준은 "에러/정보"가 아니라 **"사용자가 뭘 해야 하는가"** 이다.
- 사용자가 **행동**해야 하거나 **왜 진행이 막히는지** 알아야 함 → **지속 UI**
  (폼 검증은 RHF 인라인, 비즈니스/서버 거부·치명 오류는 `GlobalOverlay`/`ErrorBoundary`). **토스트 금지**
- **자기 행동의 단발성 결과**이고 행동이 불필요함 → **sonner 토스트**(`bottom-right`)
  예: "설치되었습니다", "변환되었습니다"
- 커스텀 토스트(`useToast`)와 sonner는 **공존** 중이다. 신규 알림은 sonner 사용 권장.

## 참고
- 작업 이력/결정 근거: `docs/development-notes.md`
- 요약: `docs/development-notes-summary.md`
- 라이브러리 목록: `libraries.md`
