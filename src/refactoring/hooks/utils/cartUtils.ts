import { CartItem, Coupon, Product } from "../../../types";

export const findCartItem = (cart: CartItem[], productId: string) => {
  return cart.find((item) => item.product.id === productId);
};

// 할인 없이 총액을 계산해야 합니다.
// 수량에 따라 올바른 할인을 적용해야 합니다.
export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  // 함수로 최대 할인율 계산
  const maxApplicableDiscount = getMaxApplicableDiscount(item);

  // 만약 할인율이 0이면 할인을 미적용 > 총액 계산
  if (maxApplicableDiscount === 0) {
    return price * quantity;
  }

  // 총액에서 할인 적용
  const totalBeforeDiscount = price * quantity;
  const totalAfterDiscount = totalBeforeDiscount * (1 - maxApplicableDiscount);

  return totalAfterDiscount;
};

// 적용 가능한 가장 높은 할인율을 반환해야 합니다
// 할인이 적용되지 않으면 0을 반환해야 합니다
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;

  // 수량에 따라 제품별 가능한 최대 할인율 계산
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity
      ? Math.max(maxDiscount, discount.rate)
      : maxDiscount;
  }, 0);
};

// 쿠폰 적용 함수
export const getApplyCoupon = (
  totalAfterDiscount: number,
  totalBeforeDiscount: number,
  selectedCoupon: Coupon | null
) => {
  let finalTotalAfterDiscount = totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      finalTotalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      finalTotalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  const totalDiscount = totalBeforeDiscount - finalTotalAfterDiscount;

  return {
    totalAfterDiscount: finalTotalAfterDiscount,
    totalDiscount,
  };
};

// 장바구니에 담긴 상품들의 할인 전 합계 함수
export const getTotalBeforeDiscount = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
};

// 장바구니에 담긴 상품들의 할인 후 합계 함수
export const getTotalAfterDiscount = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => {
    const itemAfterDiscount = calculateItemTotal(item); // utils 함수 호출
    return acc + itemAfterDiscount;
  }, 0);
};

// 쿠폰 없이 총액을 올바르게 계산해야 합니다
// 금액쿠폰을 올바르게 적용해야 합니다
// 퍼센트 쿠폰을 올바르게 적용해야 합니다
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  // 장바구니에서 할인 전 총액 계산
  const totalBeforeDiscount = getTotalBeforeDiscount(cart);

  // 장바구니에서 할인 후 총액 계산 (getTotalAfterDiscount 함수 사용)
  const totalAfterDiscount = getTotalAfterDiscount(cart);

  // 쿠폰 적용 (applyCoupon 함수 사용)
  const { totalAfterDiscount: totalAfterCoupon, totalDiscount } =
    getApplyCoupon(totalAfterDiscount, totalBeforeDiscount, selectedCoupon);

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCoupon),
    totalDiscount: Math.round(totalDiscount),
  };
};

// 장바구니에 추가하거나 수량을 업데이트하는 로직을 분리
export const getUpdatedCart = (
  cart: CartItem[],
  product: Product
): CartItem[] => {
  // 동일한 상품이 이미 장바구니에 있는지 확인
  const existingItem = findCartItem(cart, product.id);

  if (existingItem) {
    // 이미 장바구니에 있는 상품이면 수량만 증가
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    // 장바구니에 없는 상품 추가
    return [...cart, { product, quantity: 1 }];
  }
};

// 수량 수정한 cart Item 계산 함수
export const getUpdateCartItemQuantity = (
  item: CartItem,
  newQuantity: number
): CartItem | null => {
  const maxQuantity = item.product.stock;

  // newQuantity가 재고보다 많으면 재고 한도로 조정
  const updatedQuantity = Math.min(newQuantity, maxQuantity);

  // 수량이 0보다 크면 업데이트, 0이면 null을 반환하여 제거할 수 있도록
  return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
};

// 수량을 올바르게 업데이트해야 합니다
// 수량이 0으로 설정된 경우 항목을 제거해야 합니다.
// 재고 한도를 초과해서는 안 됩니다
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        return getUpdateCartItemQuantity(item, newQuantity); // 분리된 함수 호출
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null); // 수량이 0인 아이템을 필터링
};
