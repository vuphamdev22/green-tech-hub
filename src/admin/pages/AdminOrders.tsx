import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import StatusBadge from "../components/StatusBadge";
import { adminOrders } from "../data/adminMockData";
import { cn } from "@/lib/utils";

type Order = typeof adminOrders[0];
const statuses = ["all", "pending", "confirmed", "shipping", "delivered", "cancelled"];
const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminOrders() {
  const [orders, setOrders] = useState(adminOrders);
  const [activeStatus, setActiveStatus] = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const filtered = activeStatus === "all" ? orders : orders.filter((o) => o.status === activeStatus);

  const handleUpdateStatus = () => {
    if (!viewOrder || !newStatus) return;
    setOrders((prev) => prev.map((o) => o.id === viewOrder.id ? { ...o, status: newStatus } : o));
    setViewOrder(null);
  };

  const statusCounts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const columns: Column<Order>[] = [
    { key: "id", label: "Order ID", render: (row) => <span className="font-mono text-xs text-primary font-semibold">{row.id}</span> },
    {
      key: "customer", label: "Customer", sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.customer}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: "product", label: "Product", render: (row) => <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{row.product}</span> },
    { key: "items", label: "Items", render: (row) => <span className="text-xs text-center bg-muted px-2 py-0.5 rounded-full">{row.items}</span> },
    { key: "amount", label: "Amount", sortable: true, render: (row) => <span className="font-semibold text-foreground">${row.amount.toLocaleString()}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "date", label: "Date", sortable: true, render: (row) => <span className="text-xs text-muted-foreground">{row.date}</span> },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground">{orders.length} total orders</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Filter className="w-3.5 h-3.5" />Export</Button>
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
            <span className="capitalize">{s}</span>
            <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-bold", activeStatus === s ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["id", "customer", "email"]}
        actions={(row) => (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={() => { setViewOrder(row); setNewStatus(row.status); }}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
        )}
      />

      {/* Order Detail Modal */}
      <AdminModal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.id}`} size="lg"
        footer={
          <div className="flex items-center gap-3 justify-between">
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {["pending", "confirmed", "shipping", "delivered", "cancelled"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewOrder(null)}>Close</Button>
              <Button size="sm" onClick={handleUpdateStatus}>Update Status</Button>
            </div>
          </div>
        }>
        {viewOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Customer", value: viewOrder.customer },
                { label: "Email", value: viewOrder.email },
                { label: "Order Date", value: viewOrder.date },
                { label: "Items", value: `${viewOrder.items} item(s)` },
              ].map((f) => (
                <div key={f.label} className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Product</p>
              <p className="text-sm font-medium text-foreground">{viewOrder.product}</p>
            </div>
            <div className="flex items-center justify-between bg-primary/10 rounded-xl p-4">
              <span className="text-sm font-medium text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-primary">${viewOrder.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Status:</span>
              <StatusBadge status={viewOrder.status} />
            </div>
          </div>
        )}
      </AdminModal>
    </motion.div>
  );
}
