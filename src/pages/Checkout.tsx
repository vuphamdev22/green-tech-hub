import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, CreditCard, Lock } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const steps = ["Shipping", "Payment", "Review"];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "US",
  });
  const [payment, setPayment] = useState({
    cardNumber: "", expiry: "", cvv: "", name: "",
  });
  const { items, total, clearCart } = useCartStore();
  const cartTotal = total();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    toast.success("Order placed successfully! 🎉", {
      description: "You'll receive a confirmation email shortly.",
    });
    setTimeout(() => navigate("/profile"), 500);
  };

  return (
    <div className="min-h-screen pt-20 bg-carbon-900">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-carbon-800">
        <motion.div
          className="h-full bg-brand"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-8">Checkout</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                  i === step
                    ? "text-brand"
                    : i < step
                    ? "text-foreground cursor-pointer"
                    : "text-muted-foreground cursor-default"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-black ${
                    i < step
                      ? "bg-brand text-carbon-900"
                      : i === step
                      ? "bg-brand/20 text-brand border border-brand/50"
                      : "bg-white/5 text-muted-foreground border border-white/10"
                  }`}
                >
                  {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                {s}
              </button>
              {i < steps.length - 1 && (
                <ChevronDown className="w-3 h-3 text-muted-foreground rotate-[-90deg]" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Step Content */}
          <div className="bg-card border border-white/[0.06] rounded-md p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                    Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "firstName", label: "First Name", placeholder: "John" },
                      { key: "lastName", label: "Last Name", placeholder: "Doe" },
                      { key: "email", label: "Email", placeholder: "john@example.com", type: "email", full: true },
                      { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel" },
                      { key: "address", label: "Address", placeholder: "123 Main St", full: true },
                      { key: "city", label: "City", placeholder: "New York" },
                      { key: "state", label: "State", placeholder: "NY" },
                      { key: "zip", label: "ZIP Code", placeholder: "10001" },
                    ].map(({ key, label, placeholder, type = "text", full }) => (
                      <div key={key} className={full ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          {label}
                        </label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={(shipping as Record<string, string>)[key]}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, [key]: e.target.value }))
                          }
                          className="w-full bg-carbon-700 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 w-full py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Continue to Payment →
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand" />
                    Payment Details
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: "name", label: "Name on Card", placeholder: "John Doe", full: true },
                      { key: "cardNumber", label: "Card Number", placeholder: "4242 4242 4242 4242", full: true },
                      { key: "expiry", label: "Expiry Date", placeholder: "MM/YY" },
                      { key: "cvv", label: "CVV", placeholder: "123" },
                    ].map(({ key, label, placeholder, full }) => (
                      <div key={key} className={full ? "w-full" : "inline-block w-1/2 pr-2"}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          {label}
                        </label>
                        <input
                          placeholder={placeholder}
                          value={(payment as Record<string, string>)[key]}
                          onChange={(e) =>
                            setPayment((p) => ({ ...p, [key]: e.target.value }))
                          }
                          className="w-full bg-carbon-700 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors font-mono-spec"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-brand" />
                    Your payment info is encrypted and secure
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(0)}
                      className="flex-1 py-3 border border-white/10 text-muted-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/5 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
                    >
                      Review Order →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6">Review Order</h2>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 bg-carbon-800 rounded-sm"
                      >
                        <div className="w-12 h-12 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-mono-spec text-sm font-bold text-foreground">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-white/10 text-muted-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/5 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Place Order
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-card border border-white/[0.06] rounded-md p-6 h-fit sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="font-mono-spec text-foreground flex-shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="font-bold text-foreground text-sm">Total</span>
              <span className="font-mono-spec font-black text-foreground">
                ${(cartTotal * 1.08).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
