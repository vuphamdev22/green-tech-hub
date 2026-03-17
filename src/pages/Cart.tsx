import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const cartTotal = total();
  const shipping = cartTotal > 99 ? 0 : 12.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h1 className="text-2xl font-black text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Time to upgrade your setup</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                layout
                className="flex gap-4 p-4 bg-card border border-white/[0.06] rounded-md hover:border-brand/20 transition-colors"
              >
                <div className="w-24 h-24 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
                        {item.product.category}
                      </span>
                      <h3 className="font-semibold text-foreground leading-snug mt-0.5 line-clamp-2">
                        {item.product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-mono-spec text-foreground font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-spec font-black text-foreground">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-muted-foreground font-mono-spec">
                          ${item.product.price.toLocaleString()} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-white/[0.06] rounded-md p-6 h-fit sticky top-24"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-mono-spec text-foreground">
                  ${cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono-spec text-foreground">
                  {shipping === 0 ? (
                    <span className="text-brand">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-mono-spec text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-mono-spec font-black text-xl text-foreground">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mb-4 p-3 bg-brand/10 border border-brand/20 rounded-sm text-xs text-brand">
                Add ${(99 - cartTotal).toFixed(2)} more for free shipping
              </div>
            )}

            {/* Promo code */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 bg-carbon-700 border border-white/10 rounded-sm px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
              />
              <button className="px-3 py-2 border border-white/10 rounded-sm text-xs text-muted-foreground hover:text-foreground hover:border-brand/30 transition-colors font-bold">
                Apply
              </button>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout →
            </Link>

            <Link
              to="/products"
              className="block w-full text-center py-2.5 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Trust */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-muted-foreground">
              🔒 Secure checkout · SSL encrypted
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
