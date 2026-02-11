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
    let component;
    
    switch (type) {
      case "input":
        component = <Input placeholder={placeholder} {...field} />;
        break;
      case "hidden":
		    component = <Input type="hidden" {...field}/>;
        break;
	  case "file":
        component = <Input
              type="file"
              ref={field.ref}
              multiple
              {...props}
              onChange={(e) => {
                onChange?.(e)          // 커스텀 업로드 로직
                field.onChange(e.target.files) // RHF에 파일 전달
              }}
            />;
         break;
      case "textarea":
        component = <Textarea placeholder={placeholder} {...field} />;
        break;
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
            {/* Select는 FormControl이 Trigger를 감싸야 합니다 */}
            <FormControl>
              <SelectTrigger ref={field.ref}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        component = <Checkbox checked={field.value} onCheckedChange={field.onChange} ref={field.ref} />;
        break;
    }

    return <FormControl>{component}</FormControl>;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          {renderControl(field)}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}