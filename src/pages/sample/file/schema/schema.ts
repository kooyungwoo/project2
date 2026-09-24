import { z } from 'zod'

export const formSchema = z.object({
  dataId: z.string().nullable().optional(),
  title: z.string().min(1, "제목은 필수입니다"),
})