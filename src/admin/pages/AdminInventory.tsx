import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import StatusBadge from "../components/StatusBadge";
import { cn } from "@/lib/utils";
import { getAdminInventory, updateAdminInventoryStock, type AdminInventoryItem } from "../../services/adminInventoryService";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminInventory() {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<AdminInventoryItem | null>(null);
  const [newStock, setNewStock] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminInventory();
      setInventory(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu kho");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInventory();
  }, []);

  const handleUpdateStock = async () => {
    if (!editItem) return;
    const stockValue = Number(newStock);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      setError("Số lượng không hợp lệ");
      return;
    }

    setUpdating(true);
    setError(null);
    try {
      const response = await updateAdminInventoryStock(editItem.productId, { stock: stockValue });
      setInventory((prev) => prev.map((item) => item.productId === response.data.productId ? response.data : item));
      setEditItem(null);
    } catch (err) {
      setError("Không thể cập nhật tồn kho");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const lowStockCount = useMemo(() => inventory.filter((item) => item.status === "low_stock").length, [inventory]);
  const outOfStockCount = useMemo(() => inventory.filter((item) => item.status === "out_of_stock").length, [inventory]);
  const inStockCount = useMemo(() => inventory.filter((item) => item.status === "in_stock").length, [inventory]);

  const columns: Column<AdminInventoryItem>[] = [
    {
      key: "product",
      label: "Product",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-border/80 bg-muted">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.product} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No image</div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{row.product}</p>
            <p className="text-xs font-mono text-muted-foreground">{row.sku ?? "-"}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (row) => <span className="text-xs text-muted-foreground">{row.category ?? "-"}</span> },
    {
      key: "currentStock",
      label: "Current Stock",
      sortable: true,
      render: (row) => {
        const percent = row.maxStock ? Math.min(100, (row.currentStock / row.maxStock) * 100) : 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-bold",
                row.status === "out_of_stock" ? "text-destructive" : row.status === "low_stock" ? "text-yellow-500" : "text-foreground"
              )}>{row.currentStock}</span>
              <span className="text-xs text-muted-foreground">/ {row.maxStock ?? "-"}</span>
            </div>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all",
                row.status === "out_of_stock" ? "bg-destructive" : row.status === "low_stock" ? "bg-yellow-500" : "bg-primary"
              )} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      },
    },
    { key: "minStock", label: "Min", render: (row) => <span className="text-xs text-muted-foreground">{row.minStock}</span> },
    { key: "maxStock", label: "Max", render: (row) => <span className="text-xs text-muted-foreground">{row.maxStock}</span> },
    { key: "lastRestocked", label: "Last Restocked", render: (row) => <span className="text-xs text-muted-foreground">{row.lastRestocked ?? "-"}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading inventory...</div>;
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Inventory</h1>
          <p className="text-xs text-muted-foreground">Track and manage stock levels</p>
        </div>
      </div>

      {error && <div className="text-destructive font-semibold text-sm">{error}</div>}

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lowStockCount > 0 && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{lowStockCount} products low on stock</p>
                <p className="text-xs text-muted-foreground">These items need restocking soon</p>
              </div>
            </motion.div>
          )}
          {outOfStockCount > 0 && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{outOfStockCount} products out of stock</p>
                <p className="text-xs text-muted-foreground">Immediate restocking required</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[ 
          { label: "In Stock", count: inStockCount, color: "text-primary" },
          { label: "Low Stock", count: lowStockCount, color: "text-yellow-500" },
          { label: "Out of Stock", count: outOfStockCount, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={inventory}
        columns={columns}
        searchKeys={["product", "sku", "category"]}
        actions={(row) => (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={() => { setEditItem(row); setNewStock(String(row.currentStock)); }}>
            <Edit className="w-3.5 h-3.5" />
          </Button>
        )}
      />

      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Update Stock"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button size="sm" onClick={handleUpdateStock} disabled={updating}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Update Stock
            </Button>
          </div>
        }>
        {editItem && (
          <div className="space-y-4">
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-0.5">Product</p>
              <p className="text-sm font-semibold text-foreground">{editItem.product}</p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">{editItem.sku ?? "-"}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-lg font-bold text-foreground">{editItem.currentStock}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Min</p>
                <p className="text-lg font-bold text-yellow-500">{editItem.minStock}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Max</p>
                <p className="text-lg font-bold text-muted-foreground">{editItem.maxStock}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5 block">New Stock Quantity</Label>
              <Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="Enter quantity"
                className="h-9 text-sm" min={0} max={editItem.maxStock} />
            </div>
          </div>
        )}
      </AdminModal>
    </motion.div>
  );
}
