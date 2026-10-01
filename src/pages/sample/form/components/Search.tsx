'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface FormSearchValues {
  dataId: string
}

export interface SearchProps {
  searchValues: FormSearchValues
  setSearchValues: (values: FormSearchValues) => void
  onSearch: () => void
  onPrint?: () => void
}

function Search({ searchValues, setSearchValues, onSearch, onPrint }: Readonly<SearchProps>) {

  return (
    <div className="flex gap-4 items-end mb-4">
      {/* 데이터아이디 Input */}
      <Input value={searchValues.dataId}
        onChange={e => setSearchValues({ ...searchValues, dataId: e.target.value })} placeholder="데이터아이디 입력" className="w-[240px]" />

      {/* 조회 버튼 */}
      <Button onClick={onSearch}>조회</Button>
      {/* 인쇄 버튼 */}
      <Button onClick={onPrint} className="print:hidden">인쇄</Button>
    </div>
  )
}

export default Search
