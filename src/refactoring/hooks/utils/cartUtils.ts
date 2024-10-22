import { CartItem, Coupon } from "../../../types";

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

// 쿠폰 없이 총액을 올바르게 계산해야 합니다
// 금액쿠폰을 올바르게 적용해야 합니다
// 퍼센트 쿠폰을 올바르게 적용해야 합니다
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price, discounts } = item.product;
    const { quantity } = item;

    // 할인 계산 (수량에 따른 최대 할인율 적용)
    const discount = discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount
        ? d.rate
        : maxDiscount;
    }, 0);

    // 할인이 적용되기 전의 금액 계산
    const itemTotalBeforeDiscount = price * quantity;
    totalBeforeDiscount += itemTotalBeforeDiscount;

    // 할인 적용 후의 금액 계산
    const itemTotalAfterDiscount = itemTotalBeforeDiscount * (1 - discount);
    totalAfterDiscount += itemTotalAfterDiscount;
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

// 수량을 올바르게 업데이트해야 합니다
// 수량이 0으로 설정된 경우 항목을 제거해야 합니다
// 재고 한도를 초과해서는 안 됩니다
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;

        // newQuantity가 재고보다 많으면 재고 한도로 조정
        const updatedQuantity = Math.min(newQuantity, maxQuantity);

        // 수량이 0보다 크면 업데이트, 0이면 null을 반환하여 제거할 수 있도록
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
