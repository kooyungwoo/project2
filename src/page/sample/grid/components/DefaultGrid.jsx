import PropTypes from "prop-types";
import { useRef } from 'react';
import GridPage from '@/components/GridPage'
import { useCommonQuery } from "@/hooks/useCommonQuery"
import { apiClient } from "@/lib/apiClient"

function DefaultGrid({searchValues}) {
  const gridRef = useRef(null)

  const { data: rowData } = useCommonQuery(
    ['sample-grid-search', JSON.stringify(searchValues)],
    () => apiClient.get('/sample-grid', { params: searchValues }).then(res => res.data),
    { enabled: !!searchValues.keyword } // 검색어가 있을 때만 실행(최초 로드 시 불필요한 호출 방지)
  )


  const columnDefs = [
    { field: 'name', headerName: '앱 이름' },
    { field: 'version', headerName: '버전' },
    { field: 'status', headerName: '상태' },
  ]

  const gridOptions = {
    paginationPageSize: 10,
    defaultColDef: { flex: 1 },
  }

  return <GridPage ref={gridRef} rowData={rowData} columnDefs={columnDefs} gridOptions={gridOptions} />
}

DefaultGrid.propTypes = {
  searchValues: PropTypes.shape({
    keyword: PropTypes.string,
  }).isRequired,
};

export default DefaultGrid