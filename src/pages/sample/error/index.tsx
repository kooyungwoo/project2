"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import Search from "../form/components/Search"
import { searchSchema } from "../form/schema/schema"
import { selectSampleForm } from './services/service'

export default function ErrorPage() {
  const [searchValues, setSearch] = useState({dataId: ""})
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

    console.log("검색 결과:", searchResult)
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Search searchValues={searchValues} setSearch={setSearch} onSearch={handleSearch} />
      </Card>
    </div>
  )
}