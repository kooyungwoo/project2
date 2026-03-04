"use client"

import { useState, useRef } from 'react'
import { Card } from "@/components/ui/card"
import Search from "./components/Search"
import DefaultForm from "./components/Form"
import { searchSchema } from "./schema/schema"
import { selectSampleForm } from "./services/service"
import { useReactToPrint } from "react-to-print";

export default function SampleForm() {
  // react-to-print 훅 사용을 위한 인쇄 영역 contentRef(기정의된 이름) 정의
  const contentRef = useRef(null);
  const [searchValues, setSearchValues] = useState({dataId: ''})
  const [searchResult, setSearchResult] = useState(null)

  const handleSearch = async () => {
    const result = searchSchema.safeParse(searchValues)
    if (!result.success) {
      console.error(result.error?.message)
      alert("검색 조건을 확인하세요")
      return
    }
    const resultData = await selectSampleForm(searchValues.dataId)
    setSearchResult(resultData)
  }

  const handleSearchValueChange = (newValue) => {
    setSearchValues(newValue);
  };

  // 훅을 사용하여 인쇄 기능 정의(onBeforeGetContent 같은 옵션도 존재, 필요에 따라 활용 가능)
  const handlePrint = useReactToPrint({
    // contentRef를 인쇄할 콘텐츠로 지정, 다른 이름으로 정의하는 경우 contentRef: printRef 와 같이 명시적으로 지정해야 함
    contentRef,
    documentTitle: `SampleForm_${searchValues.dataId || 'print'}`, // 인쇄되는 문서의 제목 설정
    onAfterPrint: () => console.log("인쇄 창이 닫혔습니다."), // 인쇄 후 콜백
    onPrintError: (error) => console.error("인쇄 중 오류 발생:", error), // 인쇄 오류 콜백
  });

  return (
    <div className="space-y-6 print:w-full print:max-w-none print:p-0" ref={contentRef}>
      <Card className="p-4">
        <Search searchValues={searchValues} setSearchValues={handleSearchValueChange} onSearch={handleSearch} onPrint={handlePrint} />
      </Card>
      <Card className="p-4">
        <DefaultForm searchResult={searchResult} />
      </Card>
    </div>
  )
}