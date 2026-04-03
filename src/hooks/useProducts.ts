import { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/services/productService";
import type { Product } from "@/types/product";

let cachedProducts: Product[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(cachedProducts);
  const [loading, setLoading] = useState(() => !cachedProducts);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);

    return getProducts()
      .then((res) => {
        cachedProducts = res.data;
        setProducts(res.data);
        return res.data;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load products");
        throw err;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (cachedProducts) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, reload: fetchProducts };
}
