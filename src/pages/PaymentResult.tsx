import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle, XCircle, Clock, ArrowLeft,
  CreditCard, AlertCircle, Home, ShoppingBag
} from "lucide-react";
import { toast } from "sonner";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success") === "true";
  const transactionId = searchParams.get("transactionId");
  const responseCode = searchParams.get("responseCode");
  const error = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (success) {
      toast.success("Thanh toán thành công!");
    } else if (error) {
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } else {
      toast.error("Thanh toán thất bại");
    }
  }, [success, error]);

  const getStatusMessage = () => {
    if (success) {
      return {
        title: "Thanh toán thành công!",
        message: "Đơn hàng của bạn đã được xử lý thành công.",
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    } else if (error === "processing_error") {
      return {
        title: "Lỗi xử lý",
        message: "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.",
        icon: AlertCircle,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      };
    } else {
      return {
        title: "Thanh toán thất bại",
        message: "Thanh toán không thành công. Vui lòng thử lại.",
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
      };
    }
  };

  const status = getStatusMessage();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white rounded-2xl shadow-xl border-2 ${status.borderColor} overflow-hidden`}
        >
          {/* Status Header */}
          <div className={`${status.bgColor} px-8 py-12 text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`w-20 h-20 rounded-full ${status.bgColor} border-4 ${status.borderColor} flex items-center justify-center mx-auto mb-6`}
            >
              <StatusIcon className={`w-10 h-10 ${status.color}`} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {status.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600"
            >
              {status.message}
            </motion.p>
          </div>

          {/* Details */}
          <div className="px-8 py-8">
            {transactionId && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Mã giao dịch</span>
                </div>
                <p className="text-gray-600 font-mono text-sm">{transactionId}</p>
              </motion.div>
            )}

            {responseCode && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Mã phản hồi</span>
                </div>
                <p className="text-gray-600 font-mono text-sm">{responseCode}</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Link
                to="/profile"
                className="flex-1 bg-brand hover:bg-brand/90 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Xem đơn hàng
              </Link>

              <Link
                to="/"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Tiếp tục mua sắm
              </Link>
            </motion.div>

            {/* Support Info */}
            {!success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Cần hỗ trợ?</h3>
                    <p className="text-sm text-blue-700">
                      Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ bộ phận hỗ trợ khách hàng
                      hoặc thử thanh toán lại với phương thức khác.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentResult;