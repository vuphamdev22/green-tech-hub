import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";
import cartService, { type CartItemResponse, type CartUpdatePayload } from "@/services/cartService";

export interface CartItem {
  cartItemId: number;
  product: Product;
  quantity: number;
}

const toProduct = (item: CartItemResponse): Product => ({
  id: item.productId,
  name: item.productName,
  description: "",
  price: item.price,
  rating: null,
  reviews: null,
  image: item.image,
});

const normalizeCartItems = (items: CartItemResponse[]) =>
  items.map((item) => ({
    cartItemId: item.id,
    product: toProduct(item),
    quantity: item.quantity,
  }));

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  loadCart: () => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, qty: number) => Promise<void>;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: async (product, quantity = 1) => {
        const payload = {
          productId: product.id,
          quantity,
        };
        const response = await cartService.addToCart(payload);
        set({ items: normalizeCartItems(response.data.items) });
      },
      loadCart: async () => {
        const response = await cartService.getCart();
        set({ items: normalizeCartItems(response.data.items) });
      },
      removeItem: async (cartItemId) => {
        try {
          const response = await cartService.deleteCartItem(cartItemId);
          set({ items: normalizeCartItems(response.data.items) });
        } catch (error) {
          console.error("Failed to remove cart item", error);
        }
      },
      updateQuantity: async (cartItemId, qty) => {
        if (qty <= 0) {
          await cartService.deleteCartItem(cartItemId)
            .then((res) => set({ items: normalizeCartItems(res.data.items) }))
            .catch((error) => console.error("Failed to remove cart item", error));
          return;
        }

        const payload: CartUpdatePayload = { cartItemId, quantity: qty };
        try {
          const res = await cartService.updateCartItem(payload);
          set({ items: normalizeCartItems(res.data.items) });
        } catch (error) {
          console.error("Failed to update cart quantity", error);
        }
      },
      clearCart: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "volt-cart" }
  )
);
