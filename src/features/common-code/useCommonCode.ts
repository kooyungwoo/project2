import { useAtom } from 'jotai';
import { commonCodeAtom } from '@/atoms/commonCodeAtom';
import { useMemo, useEffect } from 'react';
import { apiClient } from "@/lib/apiClient"
import { useCommonQuery } from '@/hooks/useCommonQuery';

export const useCommonCode = (groupCd) => {
  const [commonCodes, setCommonCode] = useAtom(commonCodeAtom);

  // React Query를 통해 조회 (캐시 활용-신선도 관리 및 중복 호출 방지(common-code key 사용))
  const { data } = useCommonQuery(
    ["common-code"], 
    () => apiClient.get("/common/common-codes", { globalLoading: false }).then(res => res.data), 
    { staleTime: 1000 * 60 * 10 } // 10분간 신선함 유지
  );

  // 가져온 데이터를 Jotai 아톰에 동기화
  useEffect(() => {
    if (data && data !== commonCodes) {
      setCommonCode(data);
    }
  }, [data, setCommonCode, commonCodes]);

  // 필터링된 데이터 반환
  return useMemo(() => {
    if (!commonCodes || !Array.isArray(commonCodes)) return [];
    
    return commonCodes
      .filter(code => code.commonGroupCd === groupCd);
  }, [commonCodes, groupCd]);
};

// 코드값으로 명칭 찾기 전용 훅
export const useCodeName = (groupCd, value) => {
  const codes = useCommonCode(groupCd); // useCommonCode 훅 재사용
  
  return useMemo(() => {
    const target = codes.find(c => c.commonValue === value);
    return target ? target.commonName : value; // 못 찾으면 원래 값 반환
  }, [codes, value]);
};