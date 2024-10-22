import { useState, useEffect } from "react";
import { Coupon } from "../../types.ts";

// 쿠폰 적용 custom hook
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 쿠폰 추가 함수
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  // 쿠폰 선택 (적용) 함수
  const applyCoupon = (index: number) => {
    const coupon = coupons[index];
    // 쿠폰 선택 시 쿠폰 상태 변경
    setSelectedCoupon(coupon || null);
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
    selectedCoupon,
    applyCoupon,
  };
};
