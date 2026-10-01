import { apiClient } from '@/lib/apiClient'

const BASE_URL = '/sample-form'

export const selectSampleForm = async (dataId: string | number) => {
  const { data } = await apiClient.get(`${BASE_URL}/${dataId}`)
  return data
}

export const saveSampleForm = async (formData: unknown) => {
  const { data } = await apiClient.post(BASE_URL, formData)
  return data
}

export const deleteSampleForm = async (dataId: string | number) => {
  const { data } = await apiClient.delete(`${BASE_URL}/${dataId}`)
  return data
}
