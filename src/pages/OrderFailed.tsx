import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  X, AlertCircle, Home, ShoppingBag, ChevronRight, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import orderService from "@/services/orderService";
import type { OrderResponse, PaymentMethod } from "@/types/order";

// Animated failure icon
function FailureCircle() {
  return (
    <div className="relative flex items-center justify-center mb-8">
      {/* Pulsing rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-red-500/20"
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
        className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center"
        >
          <X className="w-7 h-7 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const statusParam = searchParams.get("status");

    if (orderIdParam && statusParam === "failed") {
      // Fetch order from API for failed payment
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const response = await orderService.getOrderById(parseInt(orderIdParam));
          setOrder(response.data);
        } catch (error) {
          console.error("Failed to fetch order", error);
          toast.error("Không thể tải thông tin đơn hàng");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      // No valid data, redirect to home
      navigate("/");
    }
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-carbon-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const orderId = order.orderId ? `VG-${order.orderId}` : `VG-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-carbon-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Failure Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <FailureCircle />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-black tracking-tight text-foreground mb-2"
          >
            Payment Failed 😔
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-muted-foreground text-sm"
          >
            Your payment could not be processed. Please try again or contact support.
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
              <p className="text-xl font-mono font-black text-red-400">{orderId}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{order.status}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Payment Method</p>
              <p className="font-bold text-foreground capitalize">
                {order.paymentMethod === "VNPAY" ? "VNPay" : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Order Total</p>
              <p className="font-mono font-black text-red-400">${order.totalPrice.toFixed(2)}</p>
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
              <p className="text-muted-foreground mb-1">Order Date</p>
              <p className="font-bold text-foreground">{order.createdAt || "N/A"}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Failure Notice ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-foreground">Payment was not successful</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your order has been saved but payment was not completed.
              You can try paying again or contact our support team.
            </p>
          </div>
        </motion.div>

        {/* ── Items Summary ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/"
            className="flex-1 py-3 bg-white/5 border border-white/10 text-foreground font-bold text-sm uppercase tracking-wide rounded-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 py-3 bg-red-500 text-white font-black text-sm uppercase tracking-widest rounded-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}