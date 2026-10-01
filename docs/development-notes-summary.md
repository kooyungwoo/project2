# project2 작업 요약 노트 (Summary)

> React CMS 관리자 템플릿 프로젝트의 핵심 리팩토링, 템플릿 이식, 정책 결정 사항 요약.
> 상세 내용은 `docs/development-notes.md` 참고.

- **브랜치**: `feature/20260924`(템플릿 이식, 미커밋) / `feature/20260917`(TS 전환·구조 정리, 커밋·푸시 완료)
- **검증**: `tsc --noEmit` / `eslint` / `stylelint` / `vite build` 모두 통과

---

## 1. 핵심 리팩토링

### 1) TypeScript 전환
- `src` 하위 **78개** 파일 `.js/.jsx` → `.ts/.tsx` (`git mv`로 이력 유지), `vite.config.ts` 전환
- `tsconfig.json`(`strict: false` + `strictNullChecks: true`, `@/*` path alias), `tsc --noEmit` 빌드 파이프라인 구축
- 변환 중 기존 버그/버전 이슈 수정: react-query v5(`gcTime`/`isPending`), zod v4 API, PropTypes 제거, shadcn TS 패턴 변환

### 2) 구조 / 네이밍 정리
- `lib`/`utils` 통합(`utils/` 제거), theme를 `provider/theme/`로 co-locate, `context/` 제거
- 네이밍 통일: `Sidebar`, `useToast`, `src/page/` → `src/pages/`
- **`AdminLayout`의 라우터 내부 API 의존 제거**: `routesByPath`/`match.route` + `as any` → 공개 API `matchRoutes`/`looseRoutesById`/`staticData.title`

### 3) 도메인 피처 co-locate (feature 폴더 응집)
- **`src/features/tabs/`**: tabAtom, tabActionsAtom, useTabActions, tabPolicy, TabHeader, SortableTab (+ barrel `index.ts`)
- **`src/features/common-code/`**: commonCodeAtom, useCommonCode (+ barrel)
- **`hooks/`**: 공용 인프라 훅(`useCommonQuery/Mutation`, `useConfirm`, `useToast`, `usePersisted*`, `use-mobile`)만 유지
- 빈 `src/policies/` 제거

### 4) 품질 도구 정비
- **stylelint**: CSS 오류 `--fix`, `lint:style`/`lint:all`/리포트 스크립트 신설
- **SonarQube**: `eslint-plugin-sonarjs` 도입 + `sonar-project.properties` 신설, props `Readonly<...>`, 비대화형 요소 이벤트 제거
- ⚠️ `sonar.projectKey`/`projectName`은 서버 프로젝트에 맞게 수정 필요

---

## 2. 템플릿 UI/레이아웃 이식 (`satnaing/shadcn-admin`)

- **선정 이유**: TanStack Router + TanStack Query + axios + RHF + zod가 현재 프로젝트와 동일 → 이식 비용 최소 (`shadcnstore/...`는 react-router + zustand라 부적합)
- **범위**: 기존 라우트/도메인/공통 인프라 유지, **디자인 토큰 + 레이아웃 셸만 이식**

### 1) Tailwind v3 → v4
- 추가: `tailwindcss@4`, `@tailwindcss/vite`, `tw-animate-css` / 제거: `tailwindcss-animate`, `autoprefixer`, `postcss`
- 삭제: `tailwind.config.js`, `postcss.config.js`, `src/index.css` → `src/styles/index.css` + `theme.css`(oklch 토큰)
- `components.json`(new-york/slate), stylelint v4 대응

### 2) 레이아웃 셸
- `layout/`: `app-sidebar`, `header`, `nav-group`, `nav-user`, `team-switcher` + `data/sidebar-data.ts`(메뉴 데이터화)
- `provider/layout/`(collapsible/variant, cookie 저장), `lib/cookies.ts`, `hooks/use-mobile.tsx`
- `AdminLayout` → `LayoutProvider + SidebarProvider + AppSidebar + SidebarInset + Header` (기존 TabHeader/KeepAlive/Footer 유지)
- UI 추가: `sidebar`, `sheet`, `tooltip`, `separator`, `skeleton`, `collapsible`, `dropdown-menu`, `avatar`, `badge`, `scroll-area`

### 3) sonner 토스트 (커스텀과 공존)
- `components/ui/sonner.tsx` 추가, `App.tsx`에 커스텀 `<Toaster/>`와 함께 마운트 — 기존 커스텀 토스트/`GlobalOverlay` 유지
- 디자인을 커스텀 토스트에 맞춤(`bottom-right`, popover/border 토큰, `rounded-md`, `width=min(420px,100vw-2rem)`, error=destructive)

---

## 3. 주요 정책 / 결정 사항

### 알림 / 오류 처리 정책
- 기준: (1) 사용자가 **행동**해야 하거나 **막힌 이유**를 알아야 하면 → **지속 UI**, (2) **자기 행동의 단발성 결과**면 → **토스트**
- 매핑: 검증 실패 → RHF 인라인 / 비즈니스·서버 거부 → `GlobalOverlay` alert / 치명 오류 → `GlobalOverlay`·`ErrorBoundary` / 일시 실패 → sonner(+재시도) / fire-and-forget → sonner 토스트(하단 우측)
- 한 줄 규칙: "알림을 안 봐도 다음 행동이 가능하고, 방금 한 행동의 결과임이 자명하면 토스트. 그 외는 지속 UI."

### 공통 검색(Search) 설계 방향
- **RHF + zod 확정**, `mode: 'onSubmit'` 조회 시점 검증, 값 변환은 `services/`, 공통코드는 `codeGroup` 기반 자동 옵션
- 후속: `DynamicFormField`에 `layout` 옵션, `DynamicFormSearch` + `useSearchForm` 신설

### 사이드바 메뉴
- 정적 config(`src/layout/data/sidebar-data.ts`) 기반, 추후 API/권한 기반 동적 확장 대비

---

## 4. 검증 명령어
```bash
npm run build          # tsc 타입검사 + vite 빌드
npm run typecheck      # 타입 검사만
npm run lint           # ESLint (sonarjs 포함)
npm run lint:style     # stylelint
npm run lint:all       # lint + lint:style + typecheck
npm run lint:report / lint:style:report   # SonarQube 연동 리포트
```

---

## 5. 남은 작업 (TODO)
- [ ] 기존 `components/ui`를 신세대(shadcn v4, `new-york`)로 통일 (form/select/dialog 등)
- [ ] `apiClient` 오류 라우팅을 알림/오류 정책에 맞게 분기
- [ ] `DynamicFormField` `layout` 옵션 + `DynamicFormSearch`/`useSearchForm`
- [ ] 사이드바 메뉴 API/권한 기반 동적 구성
- [ ] (확인) `useTabActions` 사용처 없음 → 죽은 코드 여부
- [ ] (선택) 테스트/Storybook 도입, `apiClient` baseURL env화, `sample` → 실제 도메인명
- [ ] **커밋** (`feature/20260924` 변경 미커밋)
