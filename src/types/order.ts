export type PaymentMethod = "cod" | "bank_transfer" | "qr_code" | "e_wallet" | "vnpay";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface CheckoutPayload extends ShippingAddress {
  paymentMethod: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderResponse {
  orderId: number;
  totalPrice: number;
  status: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt?: string;
}

export interface PaymentCreatePayload {
  method: PaymentMethod;
  amount: number;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  status: string;
  paymentUrl?: string;
  transactionId?: string;
  createdAt?: string;
}

