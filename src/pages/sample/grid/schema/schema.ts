import { z } from 'zod'

export const searchSchema = z.object({
  condition: z.enum(["name", "version", "status"]), // 검색조건
  keyword: z.string().min(1, "검색어를 입력하세요"), // 검색어
  // period: z.string().optional(), // 검색기간 (예: YYYY-MM-DD ~ YYYY-MM-DD)
  // dataType: z.enum(["Active", "Inactive"]).optional(), // 데이터유형
})

export const responseSchema = z.object({
  name: z.string(),
  version: z.string(),
  status: z.enum(['Active', 'Inactive']),
})