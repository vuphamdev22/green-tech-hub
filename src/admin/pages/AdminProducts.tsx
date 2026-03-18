import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { adminProducts } from "../data/adminMockData";

type Product = typeof adminProducts[0];

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminProducts() {
  const [products, setProducts] = useState(adminProducts);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [deleteItem, setDeleteItem] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", sku: "", status: "active" });

  const handleAdd = () => {
    const newP: Product = {
      id: products.length + 1,
      name: form.name, category: form.category,
      price: Number(form.price), stock: Number(form.stock),
      status: form.stock === "0" ? "out_of_stock" : Number(form.stock) < 10 ? "low_stock" : "active",
      image: "📦", sku: form.sku,
    };
    setProducts((p) => [newP, ...p]);
    setAddOpen(false);
    setForm({ name: "", category: "", price: "", stock: "", sku: "", status: "active" });
  };

  const handleEdit = () => {
    if (!editItem) return;
    setProducts((p) => p.map((x) => x.id === editItem.id
      ? { ...x, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), sku: form.sku }
      : x));
    setEditItem(null);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setProducts((p) => p.filter((x) => x.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const openEdit = (p: Product) => {
    setEditItem(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), sku: p.sku, status: p.status });
  };

  const columns: Column<Product>[] = [
    {
      key: "name", label: "Product", sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-xl">{row.image}</span>
          <div>
            <p className="font-medium text-foreground text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true, render: (row) => <span className="font-semibold text-primary">${row.price.toLocaleString()}</span> },
    {
      key: "stock", label: "Stock", sortable: true,
      render: (row) => (
        <span className={row.stock === 0 ? "text-destructive font-semibold" : row.stock < 15 ? "text-yellow-500 font-semibold" : "text-foreground"}>
          {row.stock}
        </span>
      ),
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  const FormFields = () => (
    <div className="space-y-4">
      {[
        { key: "name", label: "Product Name", placeholder: "e.g. MacBook Pro 16\"" },
        { key: "sku", label: "SKU", placeholder: "e.g. APP-MBP16-001" },
        { key: "category", label: "Category", placeholder: "e.g. Laptops" },
        { key: "price", label: "Price ($)", placeholder: "999", type: "number" },
        { key: "stock", label: "Stock Quantity", placeholder: "0", type: "number" },
      ].map((f) => (
        <div key={f.key}>
          <Label className="text-xs font-medium mb-1.5 block">{f.label}</Label>
          <Input
            placeholder={f.placeholder}
            type={f.type ?? "text"}
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>
      ))}
    </div>
  );

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Products</h1>
          <p className="text-xs text-muted-foreground">{products.length} total products</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setForm({ name: "", category: "", price: "", stock: "", sku: "", status: "active" }); setAddOpen(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", count: products.filter((p) => p.status === "active").length, color: "text-primary" },
          { label: "Low Stock", count: products.filter((p) => p.status === "low_stock").length, color: "text-yellow-500" },
          { label: "Out of Stock", count: products.filter((p) => p.status === "out_of_stock").length, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKeys={["name", "category", "sku"]}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(row)}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteItem(row)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      />

      <AdminModal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Product"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button><Button size="sm" onClick={handleAdd}><Package className="w-3.5 h-3.5 mr-1" />Add Product</Button></div>}>
        <FormFields />
      </AdminModal>

      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Product"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button><Button size="sm" onClick={handleEdit}>Save Changes</Button></div>}>
        <FormFields />
      </AdminModal>

      <ConfirmDialog open={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
        title="Delete Product" message={`Remove "${deleteItem?.name}" permanently?`} confirmLabel="Delete" />
    </motion.div>
  );
}
