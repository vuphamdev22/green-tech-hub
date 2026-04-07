import axiosClient from "@/api/axiosClient";

export interface AdminInventoryItem {
  productId: number;
  product: string;
  sku?: string;
  category?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastRestocked?: string | null;
  status: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl?: string | null;
}

export interface InventoryStockPayload {
  stock: number;
}

export const getAdminInventory = () => axiosClient.get<AdminInventoryItem[]>('/admin/inventory');
export const updateAdminInventoryStock = (productId: number | string, payload: InventoryStockPayload) =>
  axiosClient.put<AdminInventoryItem>(`/admin/inventory/${productId}/stock`, payload);
