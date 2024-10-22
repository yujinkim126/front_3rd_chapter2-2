import { useState, useEffect } from "react";
import { Coupon } from "../../types.ts";

// 쿠폰 적용 custom hook
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // 쿠폰 추가 함수
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  useEffect(() => {
    if (initialCoupons && initialCoupons.length > 0) {
      // 초기 쿠폰 데이터 설정
      setCoupons(initialCoupons);
    }
  }, [initialCoupons]);

  return {
    coupons,
    addCoupon,
  };
};
