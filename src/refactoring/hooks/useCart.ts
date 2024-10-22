// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
// import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니 제품 추가 함수
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // 이미 장바구니에 있는 상품이면 수량만 증가
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 장바구니에 없는 상품 추가
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // 장바구니 제품 제거 함수
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // 장바구니 제품 수량 업데이트 함수
  const updateQuantity = (product: Product, newQuantity: number) => {
    // cart에서 productId가 있는지 확인
    const existingItem = cart.find((item) => item.product.id === product.id);

    let updatedCart;
    if (existingItem) {
      // 기존 상품이 있을 경우 수량 업데이트
      updatedCart = cart.map((item) => {
        if (item.product.id === product.id) {
          return { ...item, quantity: newQuantity };
        }
        return item; // 다른 상품들은 그대로 유지
      });
    } else {
      // 상품이 없을 경우 새로운 상품을 추가
      updatedCart = [...cart, { product, quantity: newQuantity }];
    }

    setCart(updatedCart);
  };

  // 쿠폰 선택 (적용) 함수
  const applyCoupon = (coupon: Coupon) => {
    // 쿠폰 선택 시 쿠폰 상태 변경
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => ({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  });

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
