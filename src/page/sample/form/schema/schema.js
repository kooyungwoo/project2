import { z } from 'zod'

export const searchSchema = z.object({
  dataId: z.preprocess(
    (val) => Number(val), // 문자열 → 숫자 변환
    z.number({ required_error: "데이터 seq를 입력하세요" })
      .min(1, "데이터 seq를 확인하세요")
  ),
})

export const deleteSchema = z.object({
  dataId: z.preprocess(
    (val) => Number(val), // 문자열 → 숫자 변환
    z.number({ required_error: "데이터 seq를 입력하세요" })
      .min(1, "데이터 seq를 확인하세요")
  ),
})

export const responseSchema = z.object({
  dataId: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.string(),
  printable: z.string(),
})

export const formSchema = z.object({
  dataId: z.number().nullable().optional(),
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().min(1, "내용은 필수입니다"),
  status: z.string(),
  printable: z.boolean(),
})