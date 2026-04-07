import axiosClient from "@/api/axiosClient";
import type { OrderResponse } from "@/types/order";

export interface AdminOrder extends OrderResponse {
  customer?: string;
  email?: string;
  paymentMethod?: string;
  isPaid?: boolean;
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export const getAdminOrders = () => axiosClient.get<OrderResponse[]>("/admin/orders");
export const getAdminOrder = (id: number) => axiosClient.get<OrderResponse>(`/admin/orders/${id}`);
export const updateAdminOrderStatus = (id: number, payload: UpdateOrderStatusPayload) => axiosClient.put<OrderResponse>(`/admin/orders/${id}/status`, payload);
export const markAdminOrderAsPaid = (id: number) => axiosClient.put<OrderResponse>(`/admin/orders/${id}/pay`);