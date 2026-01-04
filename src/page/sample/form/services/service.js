import { apiClient } from "@/lib/apiClient"

const BASE_URL = '/sample-form'

export const selectSampleForm = async (dataId) => {
  const res = await apiClient.get(`${BASE_URL}/${dataId}`)
  return res.data
}

export const saveSampleForm = (formData) =>
  apiClient.post(BASE_URL, formData).then(res => res.data)

export const deleteSampleForm = (dataId) =>
  apiClient.delete(`${BASE_URL}/${dataId}`).then(res => res.data)