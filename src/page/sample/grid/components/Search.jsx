import PropTypes from "prop-types";
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { searchSchema } from "../schema/schema"
import { useAtomValue } from 'jotai'
import { commonCodeAtom } from '@/atoms/commonCodeAtom'

function Search({searchValues, setSearch}) {
    const [pageSearchValues, setPageSerch] = useState(searchValues)
    const commonCodes = useAtomValue(commonCodeAtom)

    const handleSubmit = () => {
        const result = searchSchema.safeParse(pageSearchValues)
        if (!result.success) {
        console.error(result.error?.message)
        alert("검색 조건을 확인하세요")
        return
        }
        setSearch(pageSearchValues)
    }

  return (
    <div className="flex gap-4 items-end mb-4">
      {/* 검색조건 SelectBox */}
      <Select value={pageSearchValues.condition} onValueChange={(val) => setPageSerch({ ...pageSearchValues, condition: val })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="검색조건" />
        </SelectTrigger>
        <SelectContent>
          {commonCodes
          .filter(code => code.commonGroupCd === "SEARCH_TYPE")
          .map(code => (
            <SelectItem key={code.commonValue} value={code.commonValue}>
              {code.commonName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 검색어 Input */}
      <Input value={pageSearchValues.keyword}
        onChange={e => setPageSerch({ ...pageSearchValues, keyword: e.target.value })} placeholder="검색어 입력" className="w-[240px]" />

      {/* 조회 버튼 */}
      <Button onClick={handleSubmit}>조회</Button>
    </div>
  )
}

Search.propTypes = {
  searchValues: PropTypes.shape({
    condition: PropTypes.string,
    keyword: PropTypes.string,
  }).isRequired,
  setSearch: PropTypes.func.isRequired, // 함수
}

export default Search