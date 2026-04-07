import axiosClient from "@/api/axiosClient";

export interface AdminStats {
  revenue: { value: number; change: number; period: string };
  orders: { value: number; change: number; period: string };
  users: { value: number; change: number; period: string };
  products: { value: number; change: number; period: string };
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: string;
  date: string;
  items: number;
}

export const getAdminStats = () => {
  return axiosClient.get<AdminStats>("/admin/dashboard/stats");
};

export const getRevenueData = () => {
  return axiosClient.get<{ data: RevenueData[] }>("/admin/dashboard/revenue");
};

export const getTopProducts = () => {
  return axiosClient.get<{ products: TopProduct[] }>("/admin/dashboard/top-products");
};

export const getRecentOrders = () => {
  return axiosClient.get<{ orders: AdminOrder[] }>("/admin/dashboard/orders");
};