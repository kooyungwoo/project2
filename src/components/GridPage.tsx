import { forwardRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, themeAlpine, type ColDef, type GridOptions } from 'ag-grid-community'

// 모듈 등록 (컴포넌트가 처음 로드될 때 실행)
ModuleRegistry.registerModules([AllCommunityModule])

export interface GridPageProps {
  rowData?: unknown[]
  columnDefs: ColDef[]
  gridOptions?: GridOptions
}

const GridPage = forwardRef<AgGridReact, Readonly<GridPageProps>>(function GridPage(
  { rowData, columnDefs, gridOptions = {} },
  ref
) {
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    ...gridOptions.defaultColDef,
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        ref={ref}
        rowData={rowData as any[]}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        loadingOverlayComponent={() => null} // 로딩 오버레이를 빈 컴포넌트로 대체
        pagination={true}
        {...gridOptions} // 추가 옵션 확장
        theme={themeAlpine}
      />
    </div>
  )
})

export default GridPage
