import { apiClient } from "@/lib/apiClient"

const BASE_URL = '/sample-form'

export const selectSampleForm = async (dataId) => {
  const { data } = await apiClient.get(`${BASE_URL}/${dataId}`)
  return data
}

export const saveSampleForm = async (formData) => {
  const { data } = await apiClient.post(BASE_URL, formData)
  return data
}

export const deleteSampleForm = async (dataId) => {
  const { data } = await apiClient.delete(`${BASE_URL}/${dataId}`)
  return data
}