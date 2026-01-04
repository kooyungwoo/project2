"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { DynamicFormField } from "@/components/ui/DynamicFormField"
import { Form } from "@/components/ui/form"
import { formSchema, deleteSchema } from "../schema/schema"

import { useToast } from "@/hooks/use-toast"
import { useCommonMutation } from "@/hooks/useCommonMutation"
import { saveSampleForm, deleteSampleForm } from '../services/service'

import { useAtomValue } from 'jotai'
import { commonCodeAtom } from '@/atoms/commonCodeAtom'


export default function DefaultForm({ searchResult }) {
  const commonCodes = useAtomValue(commonCodeAtom)

  const initialValues = {
    dataId: "",
    title: "",
    content: "",
    status: "1",
    printable: false,
  }


  /* react-hook-form을 사용하여 폼 상태 관리(이렇게 하면 vue3의 reactive 상태 관리와 유사, form기준 으로만 동작) */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
  const { reset } = form
  const { toast } = useToast()

  // searchResult가 바뀔 때마다 폼 값 갱신
  useEffect(() => {
    if (searchResult) {
      reset({
        dataId: searchResult.dataId ?? "",
        title: searchResult.title ?? "",
        content: searchResult.content ?? "",
        status: searchResult.status ?? "1",
        printable: searchResult.printable === "true", // 문자열 → boolean 변환
      })
    }
  }, [searchResult, reset])


  const { ui: saveUi, mutate: saveMutate } = useCommonMutation(
    saveSampleForm,
    { retry: 0,
      onSuccess: (res) => {
        console.log("서버 응답 데이터:", res)
        toast({
          title: "저장 완료",
          description: "저장이 완료되었습니다.",
        })
        reset(initialValues) // 폼 초기화
      }
    }
  )

  const onSubmit = (data) => {
    saveMutate(data)
  } 

  const { ui: deleteUi, mutate: deleteMutate } = useCommonMutation(
    deleteSampleForm,
    { retry: 0,
      onSuccess: (res) => {
        console.log("서버 응답 데이터:", res)
        toast({
          title: "삭제 완료", description: "삭제가 완료되었습니다."
        })
        reset(initialValues) // 폼 초기화
      }
    }
  )

  const onDelete = () => {
    const result = deleteSchema.safeParse({dataId: form.getValues().dataId})
    if (!result.success) {
      console.error(result.error.format())
      alert("데이터를 확인하세요")
      return
    }
    deleteMutate(form.getValues().dataId)
  }

  if (saveUi) return saveUi
  if (deleteUi) return deleteUi

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        {/* dataId */}
        <DynamicFormField
            control={form.control} /* form control 연결, name기준의 값 연결 및 상태 관리(form에 입력값 자동 맵핑 onchange) */
            type="hidden"
            name="dataId"
        />
        {/* 제목 */}
        <DynamicFormField
            control={form.control}
            type="input"
            name="title"
            label="제목"
            placeholder="제목을 입력하세요"
        />

        {/* 내용 */}
        <DynamicFormField
            control={form.control}
            type="textarea"
            name="content"
            label="내용"
            placeholder="내용을 입력하세요"
        />

        {/* 상태 선택 */}
        <DynamicFormField
            control={form.control}
            type="select"
            name="status"
            label="상태"
            placeholder="상태 선택"
            options={commonCodes
          .filter(code => code.commonGroupCd === "FORM_GUBUN")
          .map(code => ({ value: code.commonValue, label: code.commonName }))}
        />

        {/* 출력 여부 체크박스 */}
        <DynamicFormField
            control={form.control}
            type="checkbox"
            name="printable"
            label="출력 여부"
        />

        {/* 제출 버튼 */}
        <div className="flex gap-2">
            <Button type="submit">저장</Button>
            <Button type="button" variant="destructive" onClick={onDelete}>삭제</Button>
        </div>
        </form>
    </Form>
  )
}