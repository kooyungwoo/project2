import { errorMessageAtom } from "@/atoms/errorAtom"
import { getDefaultStore } from "jotai"
import axios from 'axios'

const store = getDefaultStore()

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // spring-boot 서버 주소
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  res => res,
  err => {
    const config = err.config

    // 글로벌 에러 처리 옵션이 true인 경우
    if (config?.handleErrorGlobally) {
      // alert(err.response?.data?.message || "알 수 없는 에러가 발생했습니다.")
      const message = err.response?.data?.message || "알 수 없는 에러가 발생했습니다."
      store.set(errorMessageAtom, message)
    }

    // 옵션이 없거나 false면 react-query로 그대로 전달
    return Promise.reject(err)
  }
)

export { apiClient }