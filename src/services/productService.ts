import axiosClient from "@/api/axiosClient";
import type { Product } from "@/types/product";

export const getProducts = () => {
  return axiosClient.get<Product[]>("/products");
};

export const getProductById = (id: number | string) => {
  return axiosClient.get<Product>(`/products/${id}`);
};
