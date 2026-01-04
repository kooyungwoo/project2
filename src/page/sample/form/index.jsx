"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import Search from "./components/Search"
import DefaultForm from "./components/Form"
import { searchSchema } from "./schema/schema"
import { selectSampleForm } from './services/service'

export default function SampleForm() {
  const [searchValues, setSearch] = useState({dataId: ""})
  const [searchResult, setSearchResult] = useState(null)

  const handleSearch = async () => {
    const result = searchSchema.safeParse(searchValues)
    if (!result.success) {
      console.error(result.error.format())
      alert("검색 조건을 확인하세요")
      return
    }
    const resultData = await selectSampleForm(searchValues.dataId)
    setSearchResult(resultData)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Search searchValues={searchValues} setSearch={setSearch} onSearch={handleSearch} />
      </Card>
      <Card className="p-4">
        <DefaultForm searchResult={searchResult} />
      </Card>
    </div>
  )
}