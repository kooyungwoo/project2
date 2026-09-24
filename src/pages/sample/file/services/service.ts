import { apiClient } from '@/lib/apiClient'

const BASE_URL = '/sample-form/with-files'

export const saveSampleFile = (formData: unknown) =>
  apiClient.post(BASE_URL, formData).then(res => res.data)
