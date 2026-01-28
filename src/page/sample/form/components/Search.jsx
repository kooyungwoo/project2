"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PropTypes from "prop-types"

function Search({searchValues, setSearch, onSearch}) {

  return (
    <div className="flex gap-4 items-end mb-4">
      {/* 데이터아이디 Input */}
      <Input value={searchValues.dataId}
        onChange={e => setSearch({ ...searchValues, dataId: e.target.value })} placeholder="데이터아이디 입력" className="w-[240px]" />

      {/* 조회 버튼 */}
      <Button onClick={onSearch}>조회</Button>
    </div>
  )
}

Search.propTypes = {
  searchValues: PropTypes.shape({
    dataId: PropTypes.string,   // dataId는 문자열
  }).isRequired,
  setSearch: PropTypes.func.isRequired, // 함수
  onSearch: PropTypes.func.isRequired,  // 함수
}


export default Search