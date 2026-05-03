import axiosClient from "@/api/axiosClient";
import type { PaymentCreatePayload, PaymentResponse } from "@/types/order";

interface VietQRResponse {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  amount: number;
  description: string;
  qrCodeImage: string;
  transactionId: string;
}

const paymentService = {
  createPayment: (orderId: number, payload: PaymentCreatePayload) =>
    axiosClient.post<PaymentResponse>(`/payment/create`, payload, { params: { orderId } }),

  getPaymentByOrderId: (orderId: number) =>
    axiosClient.get<PaymentResponse>(`/payment/order/${orderId}`),

  handleCallback: (transactionId: string, success: boolean, note?: string) =>
    axiosClient.get<string>(`/payment/callback`, { params: { transactionId, success, note } }),

  // VietQR Methods
  generateVietQRCode: (transactionId: string) =>
    axiosClient.post<VietQRResponse>(`/vietqr/generate/${transactionId}`),

  getVietQRInfo: (transactionId: string) =>
    axiosClient.get<VietQRResponse>(`/vietqr/info/${transactionId}`),

  verifyVietQRPayment: (transactionId: string) =>
    axiosClient.get<boolean>(`/vietqr/verify/${transactionId}`),
};

export default paymentService;
