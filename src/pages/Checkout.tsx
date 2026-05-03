import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronDown, Lock, Truck, CreditCard,
  QrCode, Building2, Wallet, ChevronRight, AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import orderService from "@/services/orderService";
import { VietQRPayment } from "@/components/VietQRPayment";
import type { CheckoutPayload, PaymentMethod, ShippingAddress } from "@/types/order";

const STEPS = ["Shipping", "Payment", "Review"];

const BANKS = [
  { id: "vietcombank", name: "Vietcombank", logo: "🏦", color: "#006B5B" },
  { id: "techcombank", name: "Techcombank", logo: "🏛️", color: "#e30613" },
  { id: "mbbank",      name: "MB Bank",     logo: "🏢", color: "#0a3d7c" },
  { id: "acb",         name: "ACB",         logo: "🔵", color: "#003087" },
];

const E_WALLETS = [
  { id: "momo",   name: "MoMo",    logo: "💜", color: "#a50064" },
  { id: "zalopay", name: "ZaloPay", logo: "💙", color: "#0068ff" },
  { id: "vnpay",  name: "VNPay",   logo: "❤️", color: "#e11d48" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              i === step ? "text-brand" : i < step ? "text-foreground" : "text-muted-foreground"
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
          </div>
          {i < STEPS.length - 1 && (
            <ChevronDown className="w-3 h-3 text-muted-foreground rotate-[-90deg]" />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldInput({
  label, placeholder, type = "text", value, onChange, full,
}: {
  label: string; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-carbon-700 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
      />
    </div>
  );
}

// ─── Payment Method Card ──────────────────────────────────────────────────────
function PayMethodCard({
  selected, onClick, icon, title, subtitle,
}: {
  selected: boolean; onClick: () => void;
  icon: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-sm border transition-all text-left ${
        selected
          ? "border-brand bg-brand/10"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${
        selected ? "bg-brand/20 text-brand" : "bg-white/5 text-muted-foreground"
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${selected ? "text-foreground" : "text-muted-foreground"}`}>{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
        selected ? "border-brand" : "border-white/20"
      }`}>
        {selected && <div className="w-2 h-2 rounded-full bg-brand" />}
      </div>
    </motion.button>
  );
}

// ─── QR Code simulation ───────────────────────────────────────────────────────
function QRCodeDisplay({ amount }: { amount: number }) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-md">
      {/* Simulated QR grid */}
      <div className="w-40 h-40 grid grid-cols-7 gap-0.5">
        {Array.from({ length: 49 }).map((_, i) => {
          const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48];
          const inner  = [8,9,10,15,16,17,22,23,24];
          const rand = ((i * 2654435761) >>> 0) % 2 === 0;
          const isBlack = corners.includes(i) || inner.includes(i) || (rand && i > 6);
          return <div key={i} className={`w-full h-full ${isBlack ? "bg-carbon-900" : "bg-white"}`} />;
        })}
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-carbon-700">VOLTGEAR STORE</p>
        <p className="text-sm font-black text-carbon-900">${amount.toFixed(2)}</p>
      </div>
    </div>
  );
}

// ─── Payment simulation overlay ───────────────────────────────────────────────
function PaymentSimulator({
  onResult,
}: {
  onResult: (result: "success" | "failed") => void;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<"success" | "failed" | null>(null);

  const simulate = (outcome: "success" | "failed") => {
    setPhase("loading");
    setTimeout(() => {
      setPhase("done");
      setResult(outcome);
      setTimeout(() => onResult(outcome), 1200);
    }, 2200);
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "idle" && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex gap-3 mt-4">
          <button
            onClick={() => simulate("success")}
            className="flex-1 py-2.5 bg-brand/20 text-brand border border-brand/30 text-xs font-bold rounded-sm hover:bg-brand/30 transition-colors"
          >
            ✓ Simulate Success
          </button>
          <button
            onClick={() => simulate("failed")}
            className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-sm hover:bg-red-500/20 transition-colors"
          >
            ✗ Simulate Failed
          </button>
        </motion.div>
      )}

      {phase === "loading" && (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-3 py-6 mt-4 bg-carbon-800 rounded-sm border border-white/10">
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-brand/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ borderTopColor: "hsl(var(--brand))" }}
            />
            <CreditCard className="absolute inset-0 m-auto w-5 h-5 text-brand" />
          </div>
          <p className="text-sm font-bold text-foreground">Processing payment…</p>
          <p className="text-xs text-muted-foreground">Please do not close this page</p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col items-center gap-2 py-6 mt-4 rounded-sm border ${
            result === "success"
              ? "bg-brand/10 border-brand/30"
              : "bg-red-500/10 border-red-500/30"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              result === "success" ? "bg-brand/20" : "bg-red-500/20"
            }`}
          >
            {result === "success"
              ? <Check className="w-6 h-6 text-brand" />
              : <AlertCircle className="w-6 h-6 text-red-400" />
            }
          </motion.div>
          <p className={`text-sm font-black ${result === "success" ? "text-brand" : "text-red-400"}`}>
            {result === "success" ? "Payment Successful!" : "Payment Failed"}
          </p>
          <p className="text-xs text-muted-foreground">
            {result === "success" ? "Redirecting to order confirmation…" : "Please try again"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Checkout() {
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zipCode: "", country: "US",
  });
  const [payMethod, setPayMethod] = useState<PaymentMethod>("cod");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, total, clearCart } = useCartStore();
  const cartTotal = total();
  const taxedTotal = cartTotal * 1.08;
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const paymentMethodAPI =
        payMethod === "vnpay" ? "VNPAY" :
        payMethod === "qr_code" ? "VIETQR" :
        payMethod === "e_wallet" ? "MOMO" :
        payMethod === "cod" ? "COD" :
        payMethod === "bank_transfer" ? "BANK_TRANSFER" :
        payMethod;

      const payload: CheckoutPayload = { ...shipping, paymentMethod: paymentMethodAPI as any };
      const response = await orderService.checkout(payload);

      if (paymentMethodAPI === "VNPAY" && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return;
      }

      clearCart();
      navigate("/order-success", {
        state: {
          method: payMethod,
          order: response.data,
        },
      });
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error("Không thể tạo đơn hàng, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentResult = (result: "success" | "failed") => {
    if (result === "failed") {
      toast.error("Payment failed. Please try another method.");
      return;
    }
    void placeOrder();
  };

  // ── Shared field setter helpers ──────────────────────────────────────────────
  const updateField =
    <T extends keyof ShippingAddress>(key: T) =>
    (value: ShippingAddress[T]) =>
      setShipping((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen pt-20 bg-carbon-900">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-carbon-800">
        <motion.div
          className="h-full bg-brand"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-8">Checkout</h1>
        <StepIndicator step={step} />

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* ── Step Content ─────────────────────────────────────────────────── */}
          <div className="bg-card border border-white/[0.06] rounded-md p-6">
            <AnimatePresence mode="wait">

              {/* STEP 0 — Shipping */}
              {step === 0 && (
                <motion.div key="shipping"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand" /> Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldInput label="First Name"  placeholder="John"             value={shipping.firstName} onChange={updateField("firstName")} />
                    <FieldInput label="Last Name"   placeholder="Doe"              value={shipping.lastName}  onChange={updateField("lastName")} />
                    <FieldInput label="Email"       placeholder="john@example.com" type="email" value={shipping.email} onChange={updateField("email")} full />
                    <FieldInput label="Phone"       placeholder="+1 (555) 000-0000" type="tel" value={shipping.phone} onChange={updateField("phone")} />
                    <FieldInput label="Address"     placeholder="123 Main St"      value={shipping.address}   onChange={updateField("address")} full />
                    <FieldInput label="City"        placeholder="New York"         value={shipping.city}      onChange={updateField("city")} />
                    <FieldInput label="State"       placeholder="NY"               value={shipping.state}     onChange={updateField("state")} />
                    <FieldInput label="ZIP Code"    placeholder="10001"            value={shipping.zipCode}   onChange={updateField("zipCode")} />
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 w-full py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* STEP 1 — Payment Method */}
              {step === 1 && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand" /> Select Payment Method
                  </h2>

                  <div className="space-y-3">
                    <PayMethodCard
                      selected={payMethod === "cod"}
                      onClick={() => setPayMethod("cod")}
                      icon={<Truck className="w-5 h-5" />}
                      title="Cash on Delivery (COD)"
                      subtitle="Pay when you receive your order"
                    />
                    <PayMethodCard
                      selected={payMethod === "bank_transfer"}
                      onClick={() => setPayMethod("bank_transfer")}
                      icon={<Building2 className="w-5 h-5" />}
                      title="Bank Transfer"
                      subtitle="Transfer via your online banking app"
                    />
                    <PayMethodCard
                      selected={payMethod === "qr_code"}
                      onClick={() => setPayMethod("qr_code")}
                      icon={<QrCode className="w-5 h-5" />}
                      title="QR Code Payment"
                      subtitle="Scan QR with any banking / wallet app"
                    />
                    <PayMethodCard
                      selected={payMethod === "e_wallet"}
                      onClick={() => setPayMethod("e_wallet")}
                      icon={<Wallet className="w-5 h-5" />}
                      title="E-Wallet"
                      subtitle="MoMo, ZaloPay, VNPay and more"
                    />
                    <PayMethodCard
                      selected={payMethod === "vnpay"}
                      onClick={() => setPayMethod("vnpay")}
                      icon={<CreditCard className="w-5 h-5" />}
                      title="VNPay"
                      subtitle="Pay securely with VNPay"
                    />
                  </div>

                  {/* ── COD detail ── */}
                  <AnimatePresence>
                    {payMethod === "cod" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-brand/10 border border-brand/20 rounded-sm flex gap-3">
                          <Truck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-foreground">Pay when receiving the order</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              No payment required now. Our delivery partner will collect the amount at your door.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Bank Transfer detail ── */}
                    {payMethod === "bank_transfer" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Select your bank
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {BANKS.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => setSelectedBank(b.id)}
                                className={`p-3 rounded-sm border text-sm font-bold flex items-center gap-2 transition-all ${
                                  selectedBank === b.id
                                    ? "border-brand bg-brand/10 text-foreground"
                                    : "border-white/10 text-muted-foreground hover:bg-white/5"
                                }`}
                              >
                                <span className="text-lg">{b.logo}</span> {b.name}
                              </button>
                            ))}
                          </div>
                          {selectedBank && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-carbon-800 rounded-sm border border-white/10 text-xs space-y-2"
                            >
                              <p className="text-muted-foreground font-bold uppercase tracking-wider">Transfer Details</p>
                              <div className="flex justify-between"><span className="text-muted-foreground">Account No.</span><span className="font-mono font-bold text-foreground">0123456789</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Account Name</span><span className="font-bold text-foreground">VOLTGEAR STORE</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-mono font-black text-brand">${taxedTotal.toFixed(2)}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Note</span><span className="font-bold text-foreground">ORDER-{Math.floor(Math.random() * 90000) + 10000}</span></div>
                            </motion.div>
                          )}
                          <PaymentSimulator onResult={handlePaymentResult} />
                        </div>
                      </motion.div>
                    )}

                    {/* ── QR Code detail ── */}
                    {payMethod === "qr_code" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4">
                          <VietQRPayment
                            amount={taxedTotal}
                            description="Thanh toán đơn hàng qua VietQR"
                            onPaymentSuccess={() => {
                              toast.success("Thanh toán thành công! Đơn hàng sẽ được xử lý.");
                            }}
                            onPaymentFailed={() => {
                              toast.error("Thanh toán thất bại. Vui lòng thử lại.");
                            }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* ── E-Wallet detail ── */}
                    {payMethod === "e_wallet" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Select your e-wallet
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {E_WALLETS.map((w) => (
                              <button
                                key={w.id}
                                onClick={() => setSelectedWallet(w.id)}
                                className={`p-3 rounded-sm border text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                                  selectedWallet === w.id
                                    ? "border-brand bg-brand/10 text-foreground"
                                    : "border-white/10 text-muted-foreground hover:bg-white/5"
                                }`}
                              >
                                <span className="text-2xl">{w.logo}</span>
                                <span className="text-xs">{w.name}</span>
                              </button>
                            ))}
                          </div>
                          {selectedWallet && (
                            <PaymentSimulator onResult={handlePaymentResult} />
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ── VNPay detail ── */}
                    {payMethod === "vnpay" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-brand/10 border border-brand/20 rounded-sm flex gap-3">
                          <CreditCard className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-foreground">Pay with VNPay</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              You will be redirected to VNPay's secure payment page to complete your transaction.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(0)}
                      className="flex-1 py-3 border border-white/10 text-muted-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/5 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => (payMethod === "cod" || payMethod === "vnpay") ? setStep(2) : null}
                      disabled={payMethod !== "cod" && payMethod !== "vnpay"}
                      className={`flex-1 py-3 font-black text-sm uppercase tracking-widest rounded-sm transition-opacity flex items-center justify-center gap-2 ${
                        payMethod === "cod" || payMethod === "vnpay"
                          ? "bg-brand text-carbon-900 hover:opacity-90"
                          : "bg-white/5 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {(payMethod === "cod" || payMethod === "vnpay") ? "Review Order →" : "Complete payment above"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Review */}
              {step === 2 && (
                <motion.div key="review"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-black text-foreground mb-6">Review Order</h2>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 bg-carbon-800 rounded-sm"
                      >
                        <div className="w-12 h-12 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* COD reminder */}
                  {payMethod === "cod" && (
                    <div className="mb-6 p-4 bg-brand/10 border border-brand/20 rounded-sm flex gap-3">
                      <Truck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Pay <span className="font-bold text-brand">${taxedTotal.toFixed(2)}</span> when receiving the order
                        </p>
                      </div>
                    </div>
                  )}

                  {/* VNPay reminder */}
                  {payMethod === "vnpay" && (
                    <div className="mb-6 p-4 bg-brand/10 border border-brand/20 rounded-sm flex gap-3">
                      <CreditCard className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-foreground">VNPay Payment</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          You will be redirected to VNPay to pay <span className="font-bold text-brand">${taxedTotal.toFixed(2)}</span> securely.
                        </p>
                      </div>
                    </div>
                  )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border border-white/10 text-muted-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/5 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={placeOrder}
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm transition-opacity flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Lock className="w-4 h-4" />
                        {isSubmitting ? "Placing order..." : "Place Order"}
                      </button>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Order Summary Sidebar ─────────────────────────────────────────── */}
          <div className="bg-card border border-white/[0.06] rounded-md p-6 h-fit sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="font-mono text-foreground flex-shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono text-foreground">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-mono text-brand">FREE</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-mono text-foreground">${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="font-bold text-foreground text-sm">Total</span>
                <span className="font-mono font-black text-brand text-base">${taxedTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3 text-brand" />
              Secure 256-bit SSL checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
