import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function DynamicFormField({ control, type, name, label, placeholder, options, props, onChange }) {
  const renderControl = (field) => {
    switch (type) {
      case "input":
        return <Input placeholder={placeholder} {...field} />
      case "hidden":
        return <Input type="hidden" {...field} />
      case "file":
        return <Input
              type="file"
              multiple
              {...props}
              onChange={(e) => {
                onChange?.(e)          // 커스텀 업로드 로직
                field.onChange(e.target.files) // RHF에 파일 전달
              }}
            />
      case "textarea":
        return <Textarea placeholder={placeholder} {...field} />
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      default:
        return null
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{renderControl(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}