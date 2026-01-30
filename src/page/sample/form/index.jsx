"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import Search from "./components/Search"
import DefaultForm from "./components/Form"
import { searchSchema } from "./schema/schema"
import { selectSampleForm } from './services/service'

export default function SampleForm() {
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

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Search searchValues={searchValues} setSearchValues={handleSearchValueChange} onSearch={handleSearch} />
      </Card>
      <Card className="p-4">
        <DefaultForm searchResult={searchResult} />
      </Card>
    </div>
  )
}