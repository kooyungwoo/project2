import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { searchSchema, type GridSearchValues } from '../schema/schema'
import { useCommonCode } from '@/features/common-code'

export interface GridSearchProps {
  searchValues: GridSearchValues
  setSearch: (values: GridSearchValues) => void
}

function Search({ searchValues, setSearch }: Readonly<GridSearchProps>) {
  const [pageSearchValues, setPageSearchValues] = useState<GridSearchValues>(searchValues)
  const searchTypeOptions = useCommonCode('SEARCH_TYPE')

  const handleSubmit = () => {
    const result = searchSchema.safeParse(pageSearchValues)
    if (!result.success) {
      console.error(result.error?.message)
      alert('검색 조건을 확인하세요')
      return
    }
    setSearch(pageSearchValues)
  }

  return (
    <div className="flex gap-4 items-end mb-4">
      {/* 검색조건 SelectBox */}
      <Select value={pageSearchValues.condition} onValueChange={(val) => setPageSearchValues({ ...pageSearchValues, condition: val as GridSearchValues['condition'] })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="검색조건" />
        </SelectTrigger>
        <SelectContent>
          {searchTypeOptions
            .map(code => (
              <SelectItem key={code.commonValue} value={code.commonValue}>
                {code.commonName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {/* 검색어 Input */}
      <Input value={pageSearchValues.keyword}
        onChange={e => setPageSearchValues({ ...pageSearchValues, keyword: e.target.value })} placeholder="검색어 입력" className="w-[240px]" />

      {/* 조회 버튼 */}
      <Button onClick={handleSubmit}>조회</Button>
    </div>
  )
}

export default Search
