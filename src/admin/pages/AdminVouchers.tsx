import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { adminVouchers } from "../data/adminMockData";

type Voucher = typeof adminVouchers[0];
const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState(adminVouchers);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Voucher | null>(null);
  const [deleteItem, setDeleteItem] = useState<Voucher | null>(null);
  const [form, setForm] = useState({ code: "", type: "percentage", discount: "", minOrder: "", maxUses: "", expiry: "", status: "active" });

  const handleAdd = () => {
    const newV: Voucher = { id: vouchers.length + 1, code: form.code.toUpperCase(), type: form.type as "percentage" | "fixed", discount: Number(form.discount), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses), usedCount: 0, expiry: form.expiry, status: form.status as "active" | "inactive" | "expired" };
    setVouchers((v) => [newV, ...v]);
    setAddOpen(false);
  };
  const handleEdit = () => {
    if (!editItem) return;
    setVouchers((v) => v.map((x) => x.id === editItem.id ? { ...x, ...form, discount: Number(form.discount), minOrder: Number(form.minOrder), maxUses: Number(form.maxUses) } : x));
    setEditItem(null);
  };
  const handleDelete = () => {
    if (!deleteItem) return;
    setVouchers((v) => v.filter((x) => x.id !== deleteItem.id));
    setDeleteItem(null);
  };
  const toggleStatus = (v: Voucher) => {
    setVouchers((prev) => prev.map((x) => x.id === v.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
  };
  const openEdit = (v: Voucher) => {
    setEditItem(v);
    setForm({ code: v.code, type: v.type, discount: String(v.discount), minOrder: String(v.minOrder), maxUses: String(v.maxUses), expiry: v.expiry, status: v.status });
  };

  const columns: Column<Voucher>[] = [
    {
      key: "code", label: "Code",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Ticket className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-mono text-sm font-bold text-foreground">{row.code}</span>
        </div>
      ),
    },
    {
      key: "type", label: "Discount",
      render: (row) => (
        <span className="font-bold text-primary">
          {row.type === "percentage" ? `${row.discount}%` : `$${row.discount}`} OFF
        </span>
      ),
    },
    { key: "minOrder", label: "Min Order", render: (row) => <span className="text-xs text-muted-foreground">${row.minOrder}</span> },
    {
      key: "usedCount", label: "Usage", sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs text-foreground font-medium">{row.usedCount} / {row.maxUses}</div>
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (row.usedCount / row.maxUses) * 100)}%` }} />
          </div>
        </div>
      ),
    },
    { key: "expiry", label: "Expiry", render: (row) => <span className="text-xs text-muted-foreground">{row.expiry}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Voucher Code</Label>
          <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE25" className="h-9 text-sm font-mono uppercase" />
        </div>
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Type</Label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Discount Value</Label>
          <Input type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} placeholder="25" className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Min Order ($)</Label>
          <Input type="number" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} placeholder="100" className="h-9 text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Max Uses</Label>
          <Input type="number" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} placeholder="500" className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Expiry Date</Label>
          <Input type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} className="h-9 text-sm" />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Vouchers & Promotions</h1>
          <p className="text-xs text-muted-foreground">{vouchers.filter((v) => v.status === "active").length} active vouchers</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setForm({ code: "", type: "percentage", discount: "", minOrder: "", maxUses: "", expiry: "", status: "active" }); setAddOpen(true); }}>
          <Plus className="w-3.5 h-3.5" /> Create Voucher
        </Button>
      </div>

      <DataTable
        data={vouchers}
        columns={columns}
        searchKeys={["code"]}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => toggleStatus(row)}>
              {row.status === "active" ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(row)}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteItem(row)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      />

      <AdminModal open={addOpen} onClose={() => setAddOpen(false)} title="Create Voucher"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button><Button size="sm" onClick={handleAdd}>Create</Button></div>}>
        <FormFields />
      </AdminModal>
      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Voucher"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button><Button size="sm" onClick={handleEdit}>Save</Button></div>}>
        <FormFields />
      </AdminModal>
      <ConfirmDialog open={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
        title="Delete Voucher" message={`Remove voucher "${deleteItem?.code}"?`} confirmLabel="Delete" />
    </motion.div>
  );
}
