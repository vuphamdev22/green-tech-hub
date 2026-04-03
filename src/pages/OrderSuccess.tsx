import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Check, Package, Truck, MapPin, Home,
  ShoppingBag, ChevronRight, Copy, Download,
} from "lucide-react";
import { toast } from "sonner";
import orderService from "@/services/orderService";
import type { OrderResponse, PaymentMethod } from "@/types/order";

interface OrderState {
  method: PaymentMethod;
  order: OrderResponse;
}

const ORDER_TIMELINE = [
  { label: "Order Placed",   icon: Check,    done: true,  active: false },
  { label: "Confirmed",      icon: Package,  done: false, active: true  },
  { label: "Shipped",        icon: Truck,    done: false, active: false },
  { label: "Delivered",      icon: MapPin,   done: false, active: false },
];

// Animated check mark
function SuccessCircle() {
  return (
    <div className="relative flex items-center justify-center mb-8">
      {/* Pulsing rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1 + i * 0.35, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
          style={{ width: 80, height: 80 }}
        />
      ))}
      {/* Outer circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="w-20 h-20 rounded-full bg-brand/20 border-2 border-brand/40 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-brand flex items-center justify-center"
        >
          <Check className="w-7 h-7 text-carbon-900" strokeWidth={3} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = location.state as OrderState | null;
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const statusParam = searchParams.get("status");

    if (orderIdParam && statusParam === "paid") {
      // Fetch order from API for VNPay redirect
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const response = await orderService.getOrderById(parseInt(orderIdParam));
          setOrder(response.data);
          setMethod("vnpay");
        } catch (error) {
          console.error("Failed to fetch order", error);
          toast.error("Không thể tải thông tin đơn hàng");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else if (state) {
      // Use state from navigation
      setOrder(state.order);
      setMethod(state.method);
    } else {
      // No valid data, redirect to home
      navigate("/");
    }
  }, [state, navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-carbon-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;
  const orderId = order.orderId ? `VG-${order.orderId}` : `VG-${Date.now().toString().slice(-8)}`;
  const isCOD = method === "cod";

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    toast.success("Order ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-carbon-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Success Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <SuccessCircle />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black tracking-tight text-foreground mb-2"
          >
            Order Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-muted-foreground text-sm"
          >
            {isCOD
              ? "Your order is confirmed. Pay when you receive the package."
              : "Your payment was successful. Thank you for shopping with VoltGear!"}
          </motion.p>
        </motion.div>

        {/* ── Order ID Card ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-white/[0.06] rounded-md p-5 mb-4"
        >
          <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                <p className="text-xl font-mono font-black text-brand">{orderId}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{order.status}</p>
              </div>
            <div className="flex gap-2">
              <button
                onClick={copyOrderId}
                className="p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
                title="Copy order ID"
              >
                {copied ? <Check className="w-4 h-4 text-brand" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
              <button
                className="p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
                title="Download receipt"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Payment Method</p>
              <p className="font-bold text-foreground capitalize">
                {method === "cod"          ? "Cash on Delivery"
                  : method === "qr_code"  ? "QR Code"
                  : method === "e_wallet" ? "E-Wallet"
                  : "Bank Transfer"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Order Total</p>
              <p className="font-mono font-black text-brand">${order.totalPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Ship to</p>
                <p className="font-bold text-foreground">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {order.shippingAddress.email} • {order.shippingAddress.phone}
                </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Estimated Delivery</p>
              <p className="font-bold text-foreground">3–5 Business Days</p>
            </div>
          </div>
        </motion.div>

        {/* ── COD Notice ───────────────────────────────────────────────────── */}
        {isCOD && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4 p-4 bg-brand/10 border border-brand/20 rounded-md flex gap-3"
          >
            <Truck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-foreground">Cash on Delivery — No payment now</p>
              <p className="text-xs text-muted-foreground mt-1">
                Our delivery partner will collect{" "}
                <span className="font-bold text-brand">${order.totalPrice.toFixed(2)}</span> at your door.
                Please have the exact amount ready.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Order Timeline ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-card border border-white/[0.06] rounded-md p-5 mb-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
            Order Status
          </h3>
          <div className="flex items-start gap-0">
            {ORDER_TIMELINE.map((t, i) => {
              const Icon = t.icon;
              const isLast = i === ORDER_TIMELINE.length - 1;
              return (
                <div key={t.label} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-white/5">
                      <motion.div
                        className="h-full bg-brand"
                        initial={{ width: 0 }}
                        animate={{ width: t.done ? "100%" : "0%" }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.2 }}
                      />
                    </div>
                  )}
                  {/* Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      t.done
                        ? "bg-brand text-carbon-900"
                        : t.active
                        ? "bg-brand/20 border-2 border-brand text-brand"
                        : "bg-white/5 border border-white/10 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.div>
                  <p className={`text-[10px] font-bold mt-2 text-center leading-tight ${
                    t.done || t.active ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {t.label}
                  </p>
                  {t.active && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-brand mt-1"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Items Summary ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-card border border-white/[0.06] rounded-md p-5 mb-6"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Items Ordered
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-carbon-800 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-black text-muted-foreground">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{item.productName.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground line-clamp-1">{item.productName}</p>
                  <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono text-xs font-bold text-foreground">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/"
            className="flex-1 py-3 bg-white/5 border border-white/10 text-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/profile"
            className="flex-1 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> View Orders
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
