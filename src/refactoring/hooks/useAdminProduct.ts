import { useState } from "react";
import { Product } from "../../types.ts";

export const useAdminProduct = () => {
  // 새로 추가할 상품 정보 관리
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const resetNewProduct = () => {
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
  };

  return {
    newProduct,
    setNewProduct,
    resetNewProduct,
  };
};
