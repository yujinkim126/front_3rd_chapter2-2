import { useEffect, useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>([]);

  // 제품을 업데이트할 수 있다.
  const updateProduct = (product: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? product : p))
    );
  };

  // 새로운 제품을 추가할 수 있다.
  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  // 특정 제품으로 초기화할 수 있다.
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return {
    products,
    // getRemainingStock,
    updateProduct,
    addProduct,
  };
};
