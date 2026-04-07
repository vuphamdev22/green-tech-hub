import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Package, DollarSign, Truck, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import DataTable, { Column } from "../components/DataTable";
import type { OrderResponse } from "@/types/order";
import { getAdminOrders, getAdminOrder, updateAdminOrderStatus, markAdminOrderAsPaid, type AdminOrder, type UpdateOrderStatusPayload } from "../../services/adminOrderService";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [viewItem, setViewItem] = useState<OrderResponse | null>(null);
  const [updateItem, setUpdateItem] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const statuses = ["all", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = activeStatus === "all" ? orders : orders.filter((o) => o.status === activeStatus);
    setFilteredOrders(filtered);
  }, [orders, activeStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOrders();
      setOrders(res.data);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể load orders";
      setError(message);
      toast({
        title: "Lỗi tải dữ liệu",
        description: message,
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (order: OrderResponse) => {
    try {
      const res = await getAdminOrder(order.orderId);
      setViewItem(res.data);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể load chi tiết order";
      toast({
        title: "Lỗi xem order",
        description: message,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleUpdateStatus = async () => {
    if (!updateItem || !newStatus) return;
    try {
      const payload: UpdateOrderStatusPayload = { status: newStatus };
      const res = await updateAdminOrderStatus(updateItem.orderId, payload);
      setOrders((o) => o.map((x) => (x.orderId === updateItem.orderId ? res.data : x)));
      setUpdateItem(null);
      setNewStatus("");
      toast({
        title: "Thành công",
        description: `Cập nhật status thành ${newStatus}`,
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể cập nhật status";
      toast({
        title: "Lỗi cập nhật status",
        description: message,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleMarkAsPaid = async (order: OrderResponse) => {
    try {
      const res = await markAdminOrderAsPaid(order.orderId);
      setOrders((o) => o.map((x) => (x.orderId === order.orderId ? res.data : x)));
      toast({
        title: "Thành công",
        description: "Đã đánh dấu order đã thanh toán",
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể đánh dấu đã thanh toán";
      toast({
        title: "Lỗi thanh toán",
        description: message,
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const columns: Column<OrderResponse>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (row) => <span className="font-mono text-sm">#{row.orderId}</span>,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row) => <span className="text-sm">{row.createdAt || "N/A"}</span>,
    },
    {
      key: "shippingAddress",
      label: "Customer",
      sortable: false,
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium">{row.shippingAddress.firstName} {row.shippingAddress.lastName}</p>
          <p className="text-muted-foreground">{row.shippingAddress.email}</p>
        </div>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      sortable: true,
      render: (row) => <span className="font-semibold text-primary">${row.totalPrice.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => {
        const statusMap = {
          PENDING: "pending",
          CONFIRMED: "confirmed",
          SHIPPED: "shipping",
          DELIVERED: "delivered",
          CANCELLED: "cancelled",
        };
        return <StatusBadge status={statusMap[row.status as keyof typeof statusMap] || "pending"} />;
      },
    },
    {
      key: "paymentMethod",
      label: "Payment",
      sortable: false,
      render: (row) => (
        <div className="text-sm">
          <p>{row.paymentMethod || "N/A"}</p>
          <p className={`text-xs ${row.isPaid ? "text-green-600" : "text-red-600"}`}>
            {row.isPaid ? "Paid" : "Unpaid"}
          </p>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  const statusCounts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground">Orders</h1>
        <p className="text-xs text-muted-foreground">{orders.length} total orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => setActiveStatus(s)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:bg-muted"
            )}>
            <ShoppingCart className="w-3 h-3" />
            <span className="capitalize">{s === "all" ? "All" : s.toLowerCase()}</span>
            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-bold", activeStatus === s ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {error && <div className="text-destructive font-semibold text-sm">{error}</div>}

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchKeys={["orderId", "shippingAddress.firstName", "shippingAddress.lastName", "shippingAddress.email"]}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleView(row)}>
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-blue-500" onClick={() => { setUpdateItem(row); setNewStatus(row.status); }}>
              <Package className="w-3.5 h-3.5" />
            </Button>
            {row.paymentMethod?.toLowerCase() === "cod" && !row.isPaid && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-green-500" onClick={() => handleMarkAsPaid(row)}>
                <DollarSign className="w-3.5 h-3.5" />
              </Button>
            )}
          </>
        )}
      />

      {/* View Order Modal */}
      <AdminModal key={`view-order-${viewItem?.orderId || 'none'}`} open={!!viewItem} onClose={() => setViewItem(null)} title={`Order #${viewItem?.orderId}`} size="xl">
        {viewItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Info</h3>
                <p className="text-sm">{viewItem.shippingAddress.firstName} {viewItem.shippingAddress.lastName}</p>
                <p className="text-sm text-muted-foreground">{viewItem.shippingAddress.email}</p>
                <p className="text-sm">{viewItem.shippingAddress.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm">{viewItem.shippingAddress.address}</p>
                <p className="text-sm">{viewItem.shippingAddress.city}, {viewItem.shippingAddress.state} {viewItem.shippingAddress.zipCode}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {viewItem.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-md">
                    {item.image && <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-md object-cover" />}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm">Status: <StatusBadge status={viewItem.status.toLowerCase()} /></p>
                <p className="text-sm">Payment: {viewItem.paymentMethod} - {viewItem.isPaid ? "Paid" : "Unpaid"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${viewItem.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Update Status Modal */}
      <AdminModal key={`update-status-${updateItem?.orderId || 'none'}`} open={!!updateItem} onClose={() => setUpdateItem(null)} title="Update Order Status" size="md"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setUpdateItem(null)}>Cancel</Button><Button size="sm" onClick={handleUpdateStatus}>Update Status</Button></div>}>
        {updateItem && (
          <div className="space-y-4">
            <p className="text-sm">Update status for Order #{updateItem.orderId}</p>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground">
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog open={false} onConfirm={() => {}} onCancel={() => {}} title="" message="" />
    </motion.div>
  );
}
