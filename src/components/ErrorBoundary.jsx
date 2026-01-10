import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ErrorBoundary({ error }) {
  // Spring Boot의 ErrorResponse record 구조에 접근
  // Axios 사용 시 error.response.data에 서버 응답이 담깁니다.
  const serverError = error?.response?.data;
  
  const title = serverError?.code || "Error";
  const message = serverError?.message || error?.message || "알 수 없는 에러가 발생했습니다.";
  const validationErrors = serverError?.errors; // 우리가 만든 List<ValidationError>

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-1">{message}</div>
        
        {/* Validation 에러가 있다면 리스트로 출력 */}
        {validationErrors && validationErrors.length > 0 && (
          <ul className="mt-2 text-xs list-disc list-inside opacity-80">
            {validationErrors.map((err, idx) => (
              <li key={idx}>
                <span className="font-semibold">{err.field}</span>: {err.message}
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}