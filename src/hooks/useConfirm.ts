import { useSetAtom } from "jotai";
import { confirmAtom } from "@/atoms/confirmAtom";

export function useConfirm() {
  /* confirm 출력 메시지 설정 */
  const setConfirm = useSetAtom(confirmAtom);

  const confirm = ({ title = "확인", message = "", variant = "default" }) => {
    return new Promise((resolve) => {
      setConfirm({
        isOpen: true,
        title,
        message,
        variant,
        resolve, // 여기서 프로미스의 resolve를 넘겨줌
      });
    });
  };

  return confirm;
}