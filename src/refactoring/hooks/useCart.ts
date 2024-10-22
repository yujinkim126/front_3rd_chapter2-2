// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  calculateCartTotal,
  getUpdatedCart,
  updateCartItemQuantity,
} from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니에 제품 추가 함수
  const addToCart = (product: Product) => {
    setCart((prevCart) => getUpdatedCart(prevCart, product));
  };

  // 장바구니 제품 제거 함수
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // 장바구니 제품 수량 업데이트 함수
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  // 쿠폰 선택 (적용) 함수
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  // 상품 총 금액 계산 함수
  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
