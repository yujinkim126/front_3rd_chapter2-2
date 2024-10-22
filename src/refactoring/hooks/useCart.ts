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

  // 상품 총 금액 계산 함수
  const calculateTotal = () => {
    // 장바구니에 담긴 상품들의 총 금액 계산
    const totalBeforeDiscount = cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    // 할인 적용 후 총 금액 계산
    const totalAfterDiscount = cart.reduce((acc, item) => {
      const itemTotal = item.product.price * item.quantity;

      // 상품 자체에 할인이 있는 경우 계산
      const productDiscount = item.product.discounts.reduce(
        (maxDiscount, discount) => {
          return item.quantity >= discount.quantity
            ? Math.max(maxDiscount, discount.rate)
            : maxDiscount;
        },
        0
      );
      // 할인 적용
      const itemAfterDiscount = itemTotal * (1 - productDiscount);

      return acc + itemAfterDiscount;
    }, 0);

    // 쿠폰 적용 후 총 금액 계산
    const totalAfterCoupon = selectedCoupon
      ? selectedCoupon.discountType === "amount"
        ? Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
        : totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      : totalAfterDiscount;

    // 할인된 금액 계산
    const totalDiscount = totalBeforeDiscount - totalAfterCoupon;

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterCoupon),
      totalDiscount: Math.round(totalDiscount),
    };
  };

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
