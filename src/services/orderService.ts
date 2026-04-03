import axiosClient from "@/api/axiosClient";
import type { CheckoutPayload, OrderResponse } from "@/types/order";

const orderService = {
  checkout: (payload: CheckoutPayload) => axiosClient.post<OrderResponse>("/orders/checkout", payload),
  getOrders: () => axiosClient.get<OrderResponse[]>("/orders"),
  getOrderById: (id: number) => axiosClient.get<OrderResponse>(`/orders/${id}`),
};

export default orderService;
export type { OrderResponse, CheckoutPayload };
