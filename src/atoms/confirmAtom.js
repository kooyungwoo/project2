import { atom } from "jotai";

export const confirmAtom = atom({
  isOpen: false,
  title: "확인",
  message: "",
  variant: "default",
  resolve: null, // Promise의 resolve 함수를 보관
});