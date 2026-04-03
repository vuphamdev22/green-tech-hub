import axiosClient from "@/api/axiosClient";

export interface CartAddPayload {
  productId: number | string;
  quantity: number;
}

export interface CartUpdatePayload {
  cartItemId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  productId: number | string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  totalPrice: number;
}

const cartService = {
  addToCart: (payload: CartAddPayload) => axiosClient.post<CartResponse>("/cart/add", payload),
  getCart: () => axiosClient.get<CartResponse>("/cart"),
  updateCartItem: (payload: CartUpdatePayload) => axiosClient.put<CartResponse>("/cart/update", payload),
  deleteCartItem: (cartItemId: number) =>
    axiosClient.delete<CartResponse>(`/cart/item/${cartItemId}`),
};

export default cartService;
