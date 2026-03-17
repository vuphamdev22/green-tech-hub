import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, total, count } = useCartStore();
  const cartTotal = total();
  const cartCount = count();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.5 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-carbon-700 border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand" />
                <h2 className="font-bold text-foreground">Cart</h2>
                {cartCount > 0 && (
                  <span className="text-xs bg-brand text-carbon-900 font-black px-2 py-0.5 rounded-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-md flex items-center justify-center">
                    <Zap className="w-8 h-8 text-brand/30" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some gear to get started</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-brand text-carbon-900 font-bold text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 bg-carbon-800 rounded-sm border border-white/5"
                    >
                      <div className="w-16 h-16 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-brand font-mono-spec font-bold">
                          ${item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 border border-white/10 rounded-sm overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono-spec text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-mono-spec font-bold text-foreground text-lg">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                >
                  Checkout → ${cartTotal.toLocaleString()}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-2.5 border border-white/10 text-foreground text-sm font-semibold hover:bg-white/5 rounded-sm transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
