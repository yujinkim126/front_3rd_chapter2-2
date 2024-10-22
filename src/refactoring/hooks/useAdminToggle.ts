import { useState } from "react";
import { Product } from "../../types.ts";

export const useAdminToggle = () => {
  // 여러 상품의 열림/닫힘 상태 관리
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  // 현재 편집 중인 상품
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 새 상품 추가 폼의 열림/닫힘 상태
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm((prev) => !prev);
  };

  return {
    openProductIds,
    toggleProductAccordion,
    editingProduct,
    setEditingProduct,
    showNewProductForm,
    toggleNewProductForm,
  };
};
