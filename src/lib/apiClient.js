import { errorMessageAtom } from "@/atoms/errorAtom"
import { loadingCountAtom } from "@/atoms/loadingAtom"
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
  // 글로벌 로딩 처리 옵션이 true인 경우(기본값 없으면 명식적 true설정)
  config.globalLoading = config.globalLoading ?? true;
  if (config.globalLoading) {
    store.set(loadingCountAtom, prev => prev + 1);
  }
  return config
})

apiClient.interceptors.response.use(
  res => {
    if (res.config.globalLoading) {
      store.set(loadingCountAtom, prev => Math.max(0, prev - 1));
    }
    return res;
  },
  err => {
    const config = err.config

    if (config?.globalLoading) {
      store.set(loadingCountAtom, prev => Math.max(0, prev - 1));
    }

    // 글로벌 에러 처리 옵션이 true인 경우(기본은 true)
    const handleError = config?.handleErrorGlobally ?? true;    
    if (handleError) {
      // alert(err.response?.data?.message || "알 수 없는 에러가 발생했습니다.")
      const message = err.response?.data?.message || "알 수 없는 에러가 발생했습니다."
      store.set(errorMessageAtom, message)
    }

    // 옵션이 없거나 false면 react-query로 그대로 전달
    return Promise.reject(err)
  }
)

export { apiClient }