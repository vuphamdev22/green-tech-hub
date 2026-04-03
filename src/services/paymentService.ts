import axiosClient from "@/api/axiosClient";
import type { PaymentCreatePayload, PaymentResponse } from "@/types/order";

const paymentService = {
  createPayment: (orderId: number, payload: PaymentCreatePayload) =>
    axiosClient.post<PaymentResponse>(`/payment/create`, payload, { params: { orderId } }),

  getPaymentByOrderId: (orderId: number) =>
    axiosClient.get<PaymentResponse>(`/payment/order/${orderId}`),

  handleCallback: (transactionId: string, success: boolean, note?: string) =>
    axiosClient.get<string>(`/payment/callback`, { params: { transactionId, success, note } }),
};

export default paymentService;
