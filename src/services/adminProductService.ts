import axiosClient from "@/api/axiosClient";
import type { Product, ProductCategory } from "@/types/product";

export interface AdminProduct extends Product {
  category: ProductCategory | string;
}

export interface ProductManagementPayload {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  badge?: string;
  images?: string[];
  specs?: Record<string, string>;
}

export const getAdminProducts = () => axiosClient.get<Product[]>("/admin/products");
export const getAdminProduct = (id: number | string) => axiosClient.get<Product>(`/admin/products/${id}`);
export const createAdminProduct = (payload: ProductManagementPayload) => axiosClient.post<Product>("/admin/products", payload);
export const updateAdminProduct = (id: number | string, payload: ProductManagementPayload) => axiosClient.put<Product>(`/admin/products/${id}`, payload);
export const deleteAdminProduct = (id: number | string) => axiosClient.delete<void>(`/admin/products/${id}`);
