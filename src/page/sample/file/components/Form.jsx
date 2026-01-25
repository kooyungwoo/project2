"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { DynamicFormField } from "@/components/ui/DynamicFormField"
import { Form } from "@/components/ui/form"
import { formSchema } from "../schema/schema"

import { useToast } from "@/hooks/use-toast"
import { useCommonMutation } from "@/hooks/useCommonMutation"
import { apiClient } from "@/lib/apiClient"
import { saveSampleFile } from '../services/service'
import { errorMessageAtom } from "@/atoms/errorAtom"
import { getDefaultStore } from "jotai"

export default function FileForm() {
  /* 폼의 초기값 정의(reset에도 활용) */
  const initialValues = {
    refType: "SAMPLE",
    dataId: "",
    title: "",
    uploadedFiles: [],
  }

  /* react-hook-form을 사용하여 폼 상태 관리(이렇게 하면 vue3의 reactive 상태 관리와 유사, form기준 으로만 동작) */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
  const { reset, handleSubmit, setValue, control } = form
  const { toast } = useToast()
  const uploadedFiles = useWatch({ control, name: "uploadedFiles" }) || []
  const store = getDefaultStore()

  const handleFileUpload = async (e) => {
    const files = e.target.files
    const formData = new FormData()
    formData.append("refType", initialValues.refType);
    formData.append("refId", initialValues.dataId);
    for (let file of files) {      
      formData.append("files", file)        
    }
    try{
      const res = await apiClient.post("/common/files/upload-multiple", formData, {
                                        headers: { "Content-Type": "multipart/form-data" },
                                      })
      // 서버에서 반환한 메타데이터 배열을 useForm에 저장
      setValue("uploadedFiles", [...uploadedFiles, ...res.data])
    } catch (error) {
      console.error("파일 업로드 실패:", error) 
      store.set(errorMessageAtom, "파일을 업로드하는 중에 오류가 발생했습니다.")
    }    
    e.target.value = "" // 파일 입력 초기화
  }

  const handleRemoveFile = (savedName) => {
    const filtered = uploadedFiles.filter(f => f.savedName !== savedName)
    setValue("uploadedFiles", filtered)
  }


  /* 폼 저장 처리, saveMutate을 사용하여 폼 데이터 저장(정의된 saveSampleFile 사용) */
  const { ui: saveUi, mutate: saveMutate } = useCommonMutation(
    saveSampleFile,
    { retry: 0,
      onSuccess: (res) => {
        console.log("서버 응답 데이터:", res)
        toast({
          title: "저장 완료",
          description: "저장이 완료되었습니다.",
        })
        reset(initialValues) // 폼 초기화
        setValue("uploadedFiles", []) // 업로드 파일 초기화
      }
    }
  )
  /* 폼 제출 핸들러 saveMutate 호출 */
  const onSubmit = (data) => {
    console.log("제출 데이터:", data)
    // 업로드된 파일 정보를 포함한 페이로드 생성
    const payload = {
      dataId: data.dataId,
      title: data.title,
      uploadedFiles: uploadedFiles // 업로드된 파일 배열
    };
    saveMutate(payload)
  } 

  if (saveUi) return saveUi
  

  return (
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        {/* dataId */}
        <DynamicFormField
            control={form.control} /* form control 연결, name기준의 값 연결 및 상태 관리(form에 입력값 자동 맵핑 onchange) */
            type="hidden"
            name="dataId"
        />
        <DynamicFormField
            control={form.control}
            type="hidden"
            name="refType"
        />
        {/* 제목 */}
        <DynamicFormField
            control={form.control}
            type="input"
            name="title"
            label="제목"
            placeholder="제목을 입력하세요"
        />
        {/* 파일 */}
        <DynamicFormField
            control={form.control}
            type="file"
            name="file"
            label="파일"
            placeholder="파일을 선택하세요"
            multiple 
            onChange={handleFileUpload}
        />
        {/* 업로드된 파일 목록 */}
        <div className="mt-4 rounded-md border border-gray-200 bg-white shadow-sm">
          <ul className="min-h-10 max-h-48 overflow-y-auto divide-y divide-gray-100">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map(file => (
                <li
                  key={file.savedName}
                  className="grid grid-cols-[1fr,100px,40px] items-center px-3 py-2"
                >
                  <span className="truncate">{file.originalName}</span>
                  <span className="text-sm text-gray-500 text-right">
                    {Math.round(file.size / 1024)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.savedName)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))
            ) : (
              <li className="flex items-center px-3 py-2 text-sm text-gray-400">
                업로드 파일이 없습니다
              </li>
            )}
          </ul>
        </div>
        {/* 제출 버튼 */}
        <div className="flex gap-2">
            <Button type="submit">저장</Button>
        </div>
        </form>
    </Form>
  )
}