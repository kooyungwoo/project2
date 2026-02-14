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
import PropTypes from "prop-types"

/**
 * 동적 폼 필드 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.control - React Hook Form control 객체
 * @param {string} props.type - 입력 필드 타입 (input, hidden, file, textarea, select, checkbox)
 * @param {string} props.name - 필드 이름
 * @param {string} [props.label] - 필드 라벨
 * @param {string} [props.placeholder] - 필드 플레이스홀더
 * @param {Array<{value: string, label: string}>} [props.options] - select 옵션 배열
 * @param {Object} [props.props] - 추가 props (file 타입용)
 * @param {Function} [props.onChange] - 커스텀 onChange 콜백
 * @returns {JSX.Element} 폼 필드 컴포넌트
 */
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

DynamicFormField.propTypes = {
  control: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  props: PropTypes.object,
  onChange: PropTypes.func,
}