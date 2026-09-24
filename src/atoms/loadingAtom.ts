import { atom } from "jotai";

export const isLoadingAtom = atom(false);

export const loadingCountAtom = atom(0); // 현재 실행 중인 API 개수