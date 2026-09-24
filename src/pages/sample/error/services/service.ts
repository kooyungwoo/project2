import { apiClient } from "@/lib/apiClient"

const BASE_URL = '/sample'

export const selectSampleForm = async (dataId) => {
  /** 글로벌 에러 처리 옵션을 true로 설정하여 API 호출 시 에러 발생 시 자동으로 alert 창을 띄움 */
  const res = await apiClient.get(`${BASE_URL}/${dataId}`, { handleErrorGlobally: true })
  return res.data
}