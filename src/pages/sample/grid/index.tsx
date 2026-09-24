import { useEffect } from 'react'
import Search from "./components/Search"
import DefaultGrid from "./components/DefaultGrid"
import { Card } from "@/components/ui/card"
import { usePersistedState } from "@/hooks/usePersistedState"

function IndexPage() {
  const [searchValues, setSearch, saveSearch] = usePersistedState("sample-grid-search", {
      condition: "name",
      keyword: "",
  })

  useEffect(() => {
    if (searchValues) {
      saveSearch()
    }
  }, [searchValues, saveSearch])

  return (
    <div className="space-y-6">
      {/* 검색 조건 영역 */}
      <Card className="p-4">
        <Search searchValues={searchValues} setSearch={setSearch} />
      </Card>

      {/* 그리드 영역 */}
      <Card className="p-4">
        <DefaultGrid searchValues={searchValues}/>
      </Card>
    </div>
  )
}

export default IndexPage