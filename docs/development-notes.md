# project2 작업 정리 노트

> React CMS 관리자 템플릿 프로젝트의 구조 개선 및 TypeScript 전환 작업 기록.
> 이후 작업 시 참고용.

- **브랜치**: `feature/20260917`
- **상태**: 모든 변경사항 **미커밋** (검토 후 커밋 필요)
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
| 4 | 사이드바 메뉴 하드코딩 | ⏳ 미해결 (다음 작업 후보) |
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
  index.css
  App.css                 (미사용, 제거 검토)
  routeTree.gen.ts        (자동 생성)
  vite-env.d.ts
  assets/
  atoms/                  전역 UI 상태 (alert, confirm, error, loading ...)
  components/
    (공통) ConfirmDialog, ErrorBoundary, Global*, GridPage, Loading
    ui/                   shadcn (button, form, input, select, dialog ...)
    ui/DynamicFormField.tsx
  features/
    tabs/                 tabAtom, tabActionsAtom, useTabActions, tabPolicy, TabHeader, SortableTab, index
    common-code/          commonCodeAtom, useCommonCode, index
  hooks/                  공용 인프라 훅 (useCommonQuery/Mutation, useConfirm, usePersisted*, useToast)
  layout/
    AdminLayout.tsx
    parts/                Header, Sidebar, Footer
  lib/                    apiClient, utils(cn), sessionStorage
  pages/
    sample/{error,file,form,grid,popup}/  ← index.tsx + components/schema/services
  provider/theme/         theme-context, theme-provider, useTheme, index
  routes/                 TanStack 파일 라우트 (URL /page/...)
  types/                  axios.d.ts, router.d.ts
```

---

## 8. 다음 작업 후보 (TODO)

- [ ] **4번**: 사이드바 메뉴 데이터화 (`menu.ts` config 또는 API 기반, 권한 제어 대비)
- [ ] (확인) `useTabActions` 죽은 코드 여부 — 사용처 없으면 제거 검토
- [ ] `DynamicFormField`에 `layout` 옵션 추가
- [ ] `DynamicFormSearch` + `useSearchForm` 생성
- [ ] 기존 `sample/form`, `sample/grid` 검색을 공통 컴포넌트로 교체 (템플릿 예시)
- [ ] (선택) `src/App.css`, `src/assets/react.svg` 등 미사용 파일 제거
- [ ] (선택) `apiClient`의 `baseURL` 하드코딩 → `import.meta.env.VITE_API_URL`
- [ ] (선택) `sample` 폴더를 실제 도메인명으로 교체
- [ ] (선택) 테스트 / Storybook 도입
- [ ] **커밋** (현재 모든 변경 미커밋)

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
