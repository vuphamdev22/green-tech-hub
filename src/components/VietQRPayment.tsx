import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface VietQRResponse {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
  amount: number;
  description: string;
  qrCodeImage: string;
  transactionId: string;
}

interface VietQRPaymentProps {
  amount: number;
  description: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
}

export function VietQRPayment({
  amount,
  description,
  onPaymentSuccess,
  onPaymentFailed,
}: VietQRPaymentProps) {
  const [qrData, setQrData] = useState<VietQRResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [copied, setCopied] = useState(false);

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/vietqr/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, description }),
        });

        if (!response.ok) throw new Error("Failed to generate QR");

        const data = await response.json();
        setQrData(data);
      } catch (error) {
        console.error("Error generating QR:", error);
        toast.error("Không thể tạo mã QR. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [amount, description]);

  // Poll payment status
  useEffect(() => {
    if (paymentStatus !== "pending" || !qrData?.transactionId) return;

    const interval = setInterval(async () => {
      try {
        setIsVerifying(true);
        const response = await fetch(`/api/v1/vietqr/verify/${qrData.transactionId}`);

        if (!response.ok) throw new Error("Verify failed");

        const isVerified = await response.json();

        if (isVerified) {
          setPaymentStatus("success");
          toast.success("Thanh toán thành công!");
          onPaymentSuccess?.();
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      } finally {
        setIsVerifying(false);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [paymentStatus, qrData, onPaymentSuccess]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Đã sao chép");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
          </div>
          <p className="text-muted-foreground">Đang tạo mã QR...</p>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-red-700 text-sm">Không thể tạo mã QR. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${
        paymentStatus === "success"
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200"
      }`}>
        {paymentStatus === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
        )}
        <div>
          <p className={paymentStatus === "success" ? "text-green-700 font-semibold" : "text-blue-700 font-semibold"}>
            {paymentStatus === "success" ? "✓ Thanh toán thành công!" : "Chờ xác nhận thanh toán..."}
          </p>
          <p className={paymentStatus === "success" ? "text-green-600 text-sm" : "text-blue-600 text-sm"}>
            {paymentStatus === "success"
              ? "Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý."
              : "Hãy quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán"}
          </p>
        </div>
      </div>

      {paymentStatus !== "success" && (
        <>
          {/* QR Code Display */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img
                src={qrData.qrCodeImage}
                alt="VietQR Code"
                className="w-64 h-64 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Quét mã QR bằng ứng dụng ngân hàng hoặc ứng dụng hỗ trợ VietQR
            </p>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Ngân hàng</p>
                <p className="font-semibold text-sm">{qrData.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Số tài khoản</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm font-mono">{qrData.accountNumber}</p>
                  <button
                    onClick={() => copyToClipboard(qrData.accountNumber)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Chủ tài khoản</p>
              <p className="font-semibold text-sm">{qrData.accountName}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Số tiền</p>
              <p className="font-bold text-lg text-brand">
                {qrData.amount.toLocaleString("vi-VN")} ₫
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Nội dung chuyển khoản</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm break-all font-mono text-gray-700">{qrData.description}</p>
                <button
                  onClick={() => copyToClipboard(qrData.description)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {isVerifying ? (
              <>
                <div className="h-2 w-2 bg-brand rounded-full animate-pulse" />
                Đang kiểm tra...
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                Sẵn sàng kiểm tra
              </>
            )}
          </div>
        </>
      )}

      {/* Instructions */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
        <p className="font-semibold text-amber-900 text-sm">Hướng dẫn thanh toán:</p>
        <ol className="list-decimal list-inside space-y-1 text-amber-800 text-sm">
          <li>Mở ứng dụng ngân hàng hoặc ứng dụng VietQR trên điện thoại</li>
          <li>Chọn "Quét mã QR" hoặc "Thanh toán QR"</li>
          <li>Quét mã QR trên màn hình này</li>
          <li>Xác nhận số tiền và thông tin</li>
          <li>Nhập mã PIN/OTP để hoàn tất thanh toán</li>
        </ol>
      </div>
    </div>
  );
}
