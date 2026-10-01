# project2 작업 정리 노트

> React CMS 관리자 템플릿 프로젝트의 구조 개선, TypeScript 전환, 그리고 관리자 UI 템플릿 이식 작업 기록.
> 이후 작업 시 참고용.

- **브랜치**: `feature/20260924` (템플릿 이식) / `feature/20260917` (TS 전환·구조 정리, 커밋·푸시 완료)
- **상태**: `feature/20260924`의 템플릿 이식 변경사항 **미커밋** (검토 후 커밋 필요)
- **검증**: `tsc --noEmit` / `eslint` / `stylelint` / `vite build` 모두 통과

---

## 1. JavaScript → TypeScript 전환

### 변경 요약
- `src` 하위 **78개** `.js/.jsx` → `.ts/.tsx` (`git mv`로 이력 유지)
- `vite.config.js` → `vite.config.ts`
- `index.html` 엔트리 `main.jsx` → `main.tsx`
- `components.json` `"tsx": false` → `true`

### 추가/변경된 설정 파일
| 파일 | 내용 |
| --- | --- |
| `tsconfig.json` | `strict: false` + `strictNullChecks: true`, `paths: { "@/*": ["./src/*"] }` |
| `tsconfig.node.json` | `vite.config.ts`용 |
| `src/vite-env.d.ts` | `/// <reference types="vite/client" />` |
| `src/types/axios.d.ts` | axios 커스텀 옵션(`globalLoading`, `handleErrorGlobally`) 모듈 증강 |
| `src/types/router.d.ts` | `StaticDataRouteOption`에 `title?: string` 증강 |
| 삭제 | `jsconfig.json` |

### package.json 스크립트
```json
"build": "tsc --noEmit && vite build",
"typecheck": "tsc --noEmit",
"lint": "eslint .",
"lint:style": "stylelint \"src/**/*.css\"",
"lint:report": "eslint . --format json --output-file eslint-report.json",
"lint:style:report": "stylelint \"src/**/*.css\" --formatter json --output-file stylelint-report.json",
"lint:all": "npm run lint && npm run lint:style && npm run typecheck"
```

### 변환 중 함께 수정한 것 (기존 버그/버전 이슈)
- **TanStack Router**가 `strictNullChecks`를 요구 → `tsconfig`에서 활성화
- **react-query v5**: `cacheTime` → `gcTime`, mutation `isLoading` → `isPending` (기존 `isLoading`은 alias로 유지)
- **zod v4**: `z.number({ required_error })` → `{ error }`, `result.error.errors` → `.issues`
- **PropTypes 전부 제거** → TypeScript 타입으로 대체
- **shadcn UI** 컴포넌트를 표준 TS 패턴(`React.ComponentPropsWithoutRef`, `ElementRef`)으로 변환
- `usePersistedAtom`의 `'zotai'` 오타 → `'jotai'`, 이중 `JSON.parse` 제거
- `pages/sample/error`가 `Search`에 잘못된 prop(`setSearch`)을 넘기던 문제 수정
- `TabHeader`의 정의되지 않은 `scroll()` → `scrollRef` 기반 좌우 스크롤 함수 구현

---

## 2. SonarQube / stylelint 정비

### stylelint
- CSS 오류 **20건** `--fix` 자동 수정 (색상 표기, hex 축약, 빈 줄, 대소문자 등)
- `src/index.css`의 중복 `.no-scrollbar` 규칙 제거
- 실행 스크립트 신설: `lint:style`, `lint:all`, `lint:report`, `lint:style:report`

### SonarQube
- **`eslint-plugin-sonarjs`** 도입 → `eslint.config.js`에 `sonarjs.configs.recommended` 적용 (로컬에서 Sonar 규칙 검사)
- **`sonar-project.properties`** 신설 (sources/exclusions/tsconfig/리포트 연동)
- **S6759 (React props read-only)**: 컴포넌트 props를 `Readonly<...>`로 변경
- **S6848/S1082 (비대화형 요소 이벤트)**: `App.tsx`의 `<div onClickCapture>` 제거 → `useEffect` + `document` 캡처 리스너
- `.gitignore`에 `eslint-report.json`, `stylelint-report.json`, `.scannerwork/` 추가
- ⚠️ `sonar-project.properties`의 `sonar.projectKey`/`projectName`은 서버 프로젝트에 맞게 수정 필요

---

## 3. 폴더/화면 구조 평가 결과

**총평: 7.5/10** (초보자 기준 매우 양호). 도메인 단위 구조와 상태 분리가 잘 되어 있음.

### 잘한 점
- `pages/sample/*` 아래 `components / schema / services` 기능 단위 구조
- 라우트(`routes/`)와 화면 컴포넌트(`pages/`) 분리
- 상태 계층 분리: React Query(서버) + Jotai(전역 UI) + useState(로컬)
- `apiClient` 인터셉터, `GlobalOverlay`(로딩/에러/알림/컨펌), `ui/`(shadcn)
- 탭 + KeepAlive 관리자 레이아웃

### 지적사항과 처리 상태
| # | 지적사항 | 상태 |
| --- | --- | --- |
| 1 | `lib`와 `utils` 역할 중복 | ✅ 해결 |
| 2 | `context`와 `provider` 분리 | ✅ 해결 |
| 3 | `AdminLayout`이 라우터 내부 API에 의존 | ✅ 해결 |
| 4 | 사이드바 메뉴 하드코딩 | ✅ 해결 (`layout/data/sidebar-data.ts`로 데이터화, 단 API/권한 기반 동적 구성은 미구현) |
| 5 | 기능 간 직접 import (`error` → `form`) | ➖ 템플릿 특성상 보류 |
| 6 | 네이밍 규칙 혼재 | ✅ 해결 |
| 7 | `hooks/`에 공용 인프라·도메인 훅 혼재 | ✅ 해결 |

---

## 4. 3번: 라우터 내부 API 의존 제거

`AdminLayout`이 `router.routesByPath` / `match.route` 등 **비공개 내부 구조**에 `as any`로 접근하던 것을 공식 API로 교체.

```ts
// Before (내부 구조 의존 + as any)
const router = useRouter() as any
const Component = router.routesByPath[path]?.options?.component
const title = lastMatch?.route?.options?.staticData?.title

// After (공개 API)
const router = useRouter()
const lastMatch = router.matchRoutes(path).at(-1)
const Component = router.looseRoutesById[lastMatch.routeId]?.options?.component
const title = lastMatch?.staticData?.title
```

- `src/types/router.d.ts`에서 `StaticDataRouteOption.title` 타입 증강
- `routes/page/sample/*/index.tsx` 5곳에 `staticData: { title: '...' }` 추가
  → 탭 제목이 경로 세그먼트(`form`) 대신 "폼 샘플 페이지"로 표시됨

---

## 5. 1·2·6번: 폴더/네이밍 정리

### 1) `lib` / `utils` 통합
- `src/utils/sessionStorage.ts` → `src/lib/sessionStorage.ts`
- `src/utils/` 제거, import 2곳 수정

### 2) theme co-locate
```
src/provider/theme/
  theme-context.ts     ← src/context/theme-context.ts
  theme-provider.tsx   ← src/provider/theme-provider.tsx
  useTheme.ts          ← src/hooks/use-theme.ts
  index.ts             ← barrel (ThemeProvider, useTheme 등)
```
- `src/context/` 제거, import 수정 (`App.tsx`, `Header.tsx`)

### 3) 네이밍 통일
- `SideBar.tsx` → `Sidebar.tsx`
- `use-toast.ts` → `useToast.ts` (hooks 전부 camelCase)
- `src/page/` → `src/pages/` (라우트 5곳 import 수정)
- 참고: `src/routes/page/`는 URL `/page`용 라우트 폴더로 유지 (컴포넌트 폴더 `src/pages/`와 역할이 다름)

---

## 6. 공통 검색(Search) 컴포넌트 설계 논의

### 배경
- 실제 SI에서는 업무별로 검색 화면을 구현하고, **공통 검색 컴포넌트**를 만들어 `name, defaultValue, required` 등 메타정보(config)를 받아 렌더링할 계획.
- 현재 `pages/sample/*`의 검색 재사용은 **템플릿 예시**일 뿐 → 5번(error→form 의존)은 보류.

### 결정
- **react-hook-form(RHF) + zod 사용 방향으로 확정** (검증·에러 표시·앱 일관성·`DynamicFormField` 재사용 때문)
- state 기반은 "검색이 단순할 때"의 대안일 뿐, 검증이 필요한 SI 검색에는 RHF가 적합

### 설계 원칙
1. `value`는 RHF가 소유 → config에는 `defaultValue`만. (`{ name, type, label, defaultValue, required, ... }`)
2. `<Form {...form}>` 래핑 필수 (`FormLabel`/`FormMessage`가 `useFormContext` 사용)
3. 검증 시점은 **조회 시점**: `mode: 'onSubmit'` + `handleSubmit`
4. Enter 검색: `<form onSubmit={form.handleSubmit(onSearch)}>` + `<Button type="submit">`
5. 값 변환(문자→숫자/날짜)은 UI가 아니라 `services/`에서
6. 공통코드 select는 `codeGroup`만 받아 `useCommonCode`로 옵션 자동 구성
7. `required`는 라벨 표시용과 검증을 분리 (검색은 대부분 선택)

### 앞으로 필요한 작업 2가지
1. **`DynamicFormField`에 `layout?: 'vertical' | 'horizontal'` 옵션 추가**
   - 검색바는 가로 레이아웃이 필요 (현재는 세로 + 필드별 에러문구)
2. **`DynamicFormSearch` + `useSearchForm` 생성**
   - `DynamicFormField` 재사용, `defaults`/`reset`/`submit` 헬퍼

```tsx
// 목표 형태 (예시)
export function DynamicFormSearch({ fields, schema, onSubmit, onPrint }) {
  const defaults = useMemo(() => buildDefaults(fields), [fields])
  const form = useForm({
    defaultValues: defaults,
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onSubmit',
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
        {fields.map(f => (
          <DynamicFormField key={f.name} control={form.control} layout="horizontal" {...f} />
        ))}
        <Button type="submit">조회</Button>
        <Button type="button" variant="outline" onClick={() => form.reset(defaults)}>초기화</Button>
      </form>
    </Form>
  )
}
```

### 주의 (SI 일반화)
- 실제 업무 2~3개를 먼저 만들어보고 **공통점이 보일 때 추출** (섣불리 일반화하면 props 수십 개짜리 만능 컴포넌트가 됨)

---

## 7. 현재 폴더 구조

```
src/
  App.tsx
  main.tsx
  styles/                 index.css(Tailwind v4 진입), theme.css(디자인 토큰)
  App.css                 (미사용, 제거 검토)
  routeTree.gen.ts        (자동 생성)
  vite-env.d.ts
  assets/
  atoms/                  전역 UI 상태 (alert, confirm, error, loading ...)
  components/
    (공통) ConfirmDialog, ErrorBoundary, Global*, GridPage, Loading
    ui/                   shadcn (button, form ... + sidebar/sheet/dropdown-menu 등 템플릿 이식분)
    ui/DynamicFormField.tsx
  features/
    tabs/                 tabAtom, tabActionsAtom, useTabActions, tabPolicy, TabHeader, SortableTab, index
    common-code/          commonCodeAtom, useCommonCode, index
  hooks/                  공용 인프라 훅 (useCommonQuery/Mutation, useConfirm, usePersisted*, useToast, use-mobile)
  layout/
    AdminLayout.tsx       SidebarProvider + AppSidebar + SidebarInset 셸
    app-sidebar.tsx, header.tsx, nav-group.tsx, nav-user.tsx, team-switcher.tsx, types.ts
    data/sidebar-data.ts  사이드바 메뉴 데이터
    parts/                Footer (Header/Sidebar는 템플릿 레이아웃으로 대체)
  lib/                    apiClient, utils(cn), sessionStorage, cookies
  pages/
    sample/{error,file,form,grid,popup}/  ← index.tsx + components/schema/services
  provider/
    theme/                theme-context, theme-provider, useTheme, index
    layout/               layout-provider(collapsible/variant), index
  routes/                 TanStack 파일 라우트 (URL /page/...)
  types/                  axios.d.ts, router.d.ts
```

---

## 8. 다음 작업 후보 (TODO)

- [x] ~~**4번**: 사이드바 메뉴 데이터화~~ → `layout/data/sidebar-data.ts`로 데이터화(템플릿 이식 시 선반영). API/권한 기반 확장은 남음
- [ ] 사이드바 메뉴를 API/권한 기반으로 동적 구성 (현재 정적 config)
- [ ] (확인) `useTabActions` 죽은 코드 여부 — 사용처 없으면 제거 검토
- [ ] `DynamicFormField`에 `layout` 옵션 추가
- [ ] `DynamicFormSearch` + `useSearchForm` 생성
- [ ] 기존 `sample/form`, `sample/grid` 검색을 공통 컴포넌트로 교체 (템플릿 예시)
- [ ] (선택) `src/App.css`, `src/assets/react.svg` 등 미사용 파일 제거
- [ ] (선택) `apiClient`의 `baseURL` 하드코딩 → `import.meta.env.VITE_API_URL`
- [ ] (선택) `sample` 폴더를 실제 도메인명으로 교체
- [ ] (선택) 테스트 / Storybook 도입
- [ ] **커밋** (`feature/20260924` 템플릿 이식 변경 미커밋 / `feature/20260917`은 커밋·푸시 완료)

---

## 9. 자주 쓰는 명령어

```bash
npm run dev            # 개발 서버
npm run build          # tsc 타입검사 + vite 빌드
npm run typecheck      # 타입 검사만
npm run lint           # ESLint (sonarjs 포함)
npm run lint:style     # stylelint
npm run lint:all       # lint + lint:style + typecheck
npm run lint:report    # SonarQube 연동용 eslint-report.json 생성
npm run lint:style:report  # SonarQube 연동용 stylelint-report.json 생성
```

---

## 10. SonarQube 연동 참고

- `sonar-project.properties`에 `sonar.sources`, `exclusions`, `tsconfig` 경로, `sonar.eslint.reportPaths`, `sonar.stylelint.reportPaths` 설정됨
- 스캔 전 `npm run lint:report` / `npm run lint:style:report`로 리포트 생성 후 실행
- `sonar.projectKey` / `sonar.projectName`은 사용 중인 SonarQube/SonarCloud 프로젝트에 맞게 수정

---

## 11. 7번: 도메인 훅을 feature 폴더로 co-locate

`hooks/`에 공용 인프라 훅과 도메인 훅이 섞여 있던 문제를 해결.

- **공용 인프라 훅 → `hooks/` 유지**: `useCommonQuery`, `useCommonMutation`(react-query 래퍼), `useConfirm`, `useToast`, `usePersistedAtom`, `usePersistedState`
- **도메인 훅 → `src/features/`로 이동** (훅만이 아니라 관련 상태·컴포넌트까지 함께 co-locate)

### tabs (`src/features/tabs/`)
| 이동 전 | 이동 후 |
| --- | --- |
| `atoms/tabAtom.ts` | `features/tabs/tabAtom.ts` |
| `atoms/tabActionsAtom.ts` | `features/tabs/tabActionsAtom.ts` |
| `hooks/useTabActions.ts` | `features/tabs/useTabActions.ts` |
| `policies/tabPolicy.ts` | `features/tabs/tabPolicy.ts` |
| `layout/parts/TabHeader.tsx` | `features/tabs/TabHeader.tsx` |
| `components/SortableTab.tsx` | `features/tabs/SortableTab.tsx` |
| (없음) | `features/tabs/index.ts` (barrel) |

### common-code (`src/features/common-code/`)
| 이동 전 | 이동 후 |
| --- | --- |
| `atoms/commonCodeAtom.ts` | `features/common-code/commonCodeAtom.ts` |
| `hooks/useCommonCode.ts` (`useCodeName` 포함) | `features/common-code/useCommonCode.ts` |
| (없음) | `features/common-code/index.ts` (barrel) |

- 의존 import 변경: `App.tsx`(`canOpenNextTab`), `layout/AdminLayout.tsx`(`TabHeader`/`openTabsAtom`/`tabActionsAtom`/`useCommonCode`), `pages/sample/form/components/Form.tsx`, `pages/sample/grid/components/Search.tsx`
- 빈 `src/policies/` 폴더 제거
- ⚠️ `useTabActions`는 현재 **사용처 없음(정의만 존재)**. `tabActionsAtom` + KeepAlive `drop`과 기능이 겹쳐 **죽은 코드 후보**(다음 정리 때 확인 필요)

---

## 12. satnaing/shadcn-admin 템플릿 UI/레이아웃 이식 (`feature/20260924`)

### 배경 / 결정
- 후보 2개 비교:
  - `shadcnstore/shadcn-dashboard-landing-template`: `react-router-dom` + `zustand` + Tailwind v4 → 라우팅/데이터 구조 재작성 필요.
  - **`satnaing/shadcn-admin` 선택**: TanStack Router + TanStack Query + axios + RHF + zod가 현재 프로젝트와 동일 → 이식 비용 최소.
- 범위: **기존 라우트/도메인/공통 인프라 유지, 템플릿의 디자인 토큰 + 레이아웃 셸만 이식**.

### 1) Tailwind v3 → v4
| 항목 | 변경 |
| --- | --- |
| deps 추가 | `tailwindcss@4`, `@tailwindcss/vite`, `tw-animate-css` |
| deps 제거 | `tailwindcss-animate`, `autoprefixer`, `postcss` |
| 삭제 | `tailwind.config.js`, `postcss.config.js`, `src/index.css` |
| vite | `vite.config.ts`에 `@tailwindcss/vite` 플러그인 추가 |
| 스타일 | `src/styles/index.css`(진입) + `src/styles/theme.css`(oklch 토큰, `@theme inline`) |
| `main.tsx` | `import './styles/index.css'` |
| `components.json` | `style: new-york`, `baseColor: slate`, `tailwind.config: ""`, `css: src/styles/index.css` |
| stylelint | `.stylelintrc.cjs`에 v4 at-rule ignore(`custom-variant`/`utility`/`theme` 등) + `src/styles/**` override 추가 |

### 2) UI 컴포넌트 추가 (템플릿 `components/ui`)
`sidebar`, `sheet`, `tooltip`, `separator`, `skeleton`, `collapsible`, `dropdown-menu`, `avatar`, `badge`, `scroll-area` (+ radix deps: tooltip/separator/dropdown-menu/avatar/collapsible/scroll-area)
→ 기존 `components/ui`는 유지(도메인 컴포넌트 호환). `sidebar.tsx`의 `Math.random` 린트만 `eslint-disable` 처리.

### 3) 레이아웃 셸
- 추가: `layout/app-sidebar.tsx`, `header.tsx`, `nav-group.tsx`, `nav-user.tsx`, `team-switcher.tsx`, `types.ts`, `data/sidebar-data.ts`
- `sidebar-data.ts`의 메뉴를 샘플 라우트(`/page/sample/*`)로 데이터화 → **TODO 4번(사이드바 데이터화) 일부 선반영**
- 추가: `provider/layout/`(collapsible/variant, cookie 저장), `lib/cookies.ts`, `hooks/use-mobile.tsx`
- `AdminLayout`을 `LayoutProvider + SidebarProvider + AppSidebar + SidebarInset + Header` 구조로 재구성 (기존 `TabHeader`/KeepAlive/Footer 유지)
- 제거: `layout/parts/Header.tsx`, `layout/parts/Sidebar.tsx` (테마 토글은 `nav-user`로 이동)
- `nav-user.tsx`는 템플릿의 SignOutDialog/Clerk/settings 링크를 제거하고 단순화

### 4) sonner 토스트 도입 (커스텀 토스트와 공존)
- `sonner` 설치 후 `components/ui/sonner.tsx` 래퍼 추가, `App.tsx`에 커스텀 `<Toaster/>`와 함께 `<SonnerToaster/>` 마운트
- 기존 커스텀 토스트(`toast.tsx`/`toaster.tsx`/`useToast`)는 그대로 유지 → **공존**
- 디자인은 커스텀 토스트에 맞춤: `position=bottom-right`, `--normal-bg/text/border` = `popover/border` 토큰, `--border-radius = calc(var(--radius) - 2px)`, `--width = min(420px, 100vw-2rem)`, `shadow-lg`, error만 `--error-bg/text/border = destructive/white`(커스텀 destructive variant 대응)
- 역할 분담(권장): **알림(성공/실패/정보) → sonner**, **컨펌/로딩/전역 에러 → `GlobalOverlay`(atom) 유지**

### 검증
- `tsc --noEmit` / `eslint` / `stylelint` / `vite build` 통과
- ⚠️ 실제 화면 확인은 `npm run dev`로 육안 검증 필요 (색상/radius/폰트 토큰 적용, 사이드바 접힘·모바일 시트 동작)
- ⚠️ 기존 도메인 컴포넌트(GlobalOverlay, GridPage 등)는 v3 시절 클래스 유지 → v4 유틸 차이(`shadow-sm`, `outline-none` 등)로 일부 시각 차이 가능. 순차 정리 필요.

### 후속 후보
- [ ] 기존 `components/ui`도 템플릿 v3 버전으로 통일 (form/select/dialog/toast 등)
- [x] ~~`sonner` 도입 검토~~ → 커스텀 토스트와 **공존** 도입, 디자인은 커스텀에 맞춰 토큰 매핑 (`components/ui/sonner.tsx`)
- [ ] `apiClient` 인터셉터의 오류 라우팅을 13번 정책에 맞게 분기 (지속 UI vs 토스트)
- [ ] 대시보드/차트(recharts)·데이터테이블(TanStack Table) 필요 시 선택 이식
- [ ] `libraries.md` 갱신 (Tailwind v4 및 추가 radix 패키지) — 파일 인코딩 확인 필요

---

## 13. 알림 / 오류 처리 정책 (결정)

> 토스트는 "알림"이지 **오류 처리의 만능 도구가 아니다.** 사라지는 특성 때문에 사용자가 기억하거나 대응해야 하는 오류엔 부적합하다.

### 판단 기준 (에러/정보가 아니라 "사용자가 뭘 해야 하는가")
1. 사용자가 **행동**해야 하거나, **왜 진행이 막히는지** 알아야 하는가? → **지속 UI**(인라인/모달/배너). **토스트 금지**
2. 사용자가 **이미 자기 행동**을 알고, 결과가 **행동 불필요한 단발성 확인**인가? → **토스트 허용**

### 상황별 매핑
| 상황 | UI | 예 |
| --- | --- | --- |
| 폼 검증 실패 | RHF 인라인(`FormMessage`) | 필수값 누락 |
| zod가 못 잡는 비즈니스/서버 거부 | `GlobalOverlay` alert (지속) | 이미 등록된 코드, 권한 없음, 잔액 부족 |
| 치명/전역 오류 | `GlobalOverlay` / `ErrorBoundary` | 500, 세션 만료 |
| 재시도 가능한 일시 실패 | sonner 토스트 (+`다시 시도` 액션) | 네트워크 타임아웃 |
| 단발성 확인(fire-and-forget) | sonner 토스트 (하단 우측) | 설치되었습니다, 변환되었습니다 |
| 백그라운드 완료 | sonner 토스트 (긴 duration, `보기` 액션) | 대량 변환 완료 |

### 위치 논의 결론
- 하단 우측은 "**안 봐도 되는 알림**"에만 쓴다. 외워야 하는 건 토스트로 보내지 않으므로 "안 보임"이 문제가 되지 않는다.
- "웹은 시선이 우하단으로 가지 않는다"는 지적은 타당 → 그래서 **중요한 건 토스트가 아니라 지속 UI**로 처리한다.
- 필요 시 반응형 위치(데스크톱 `bottom-right`, 모바일 `top-center`) 적용 가능. 현재는 `bottom-right` 고정.

### 한 줄 규칙
> 알림을 안 봐도 다음 행동이 가능하고, 방금 한 행동의 결과임이 자명하면 토스트. 그 외는 지속 UI.
