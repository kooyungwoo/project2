import { apiClient } from "@/lib/apiClient"

export const selectSampleForm = async (dataId) => {
  const res = await apiClient.get(`/sample-form/${dataId}`)
  return res.data
}

export const saveSampleForm = (formData) =>
  apiClient.post('/sample-form', formData).then(res => res.data)

export const deleteSampleForm = (dataId) =>
  apiClient.delete(`/sample-form/${dataId}`).then(res => res.data)