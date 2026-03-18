import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { adminCategories } from "../data/adminMockData";

type Category = typeof adminCategories[0];
const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminCategories() {
  const [cats, setCats] = useState(adminCategories);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", parent: "None", icon: "📁", status: "active" });

  const parents = cats.filter((c) => c.parent === null);

  const handleAdd = () => {
    const newC: Category = { id: cats.length + 1, name: form.name, slug: form.slug, parent: form.parent === "None" ? null : form.parent, products: 0, status: form.status as "active" | "inactive", icon: form.icon };
    setCats((c) => [...c, newC]);
    setAddOpen(false);
  };
  const handleEdit = () => {
    if (!editItem) return;
    setCats((c) => c.map((x) => x.id === editItem.id ? { ...x, ...form, parent: form.parent === "None" ? null : form.parent } : x));
    setEditItem(null);
  };
  const handleDelete = () => {
    if (!deleteItem) return;
    setCats((c) => c.filter((x) => x.id !== deleteItem.id));
    setDeleteItem(null);
  };
  const openEdit = (c: Category) => {
    setEditItem(c);
    setForm({ name: c.name, slug: c.slug, parent: c.parent ?? "None", icon: c.icon, status: c.status });
  };

  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Name</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Category Name" className="h-9 text-sm" />
        </div>
        <div>
          <Label className="text-xs font-medium mb-1.5 block">Icon</Label>
          <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="📁" className="h-9 text-sm" />
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium mb-1.5 block">Slug</Label>
        <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="category-slug" className="h-9 text-sm font-mono" />
      </div>
      <div>
        <Label className="text-xs font-medium mb-1.5 block">Parent Category</Label>
        <select value={form.parent} onChange={(e) => setForm((f) => ({ ...f, parent: e.target.value }))}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="None">None (Top-level)</option>
          {parents.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <Label className="text-xs font-medium mb-1.5 block">Status</Label>
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Categories</h1>
          <p className="text-xs text-muted-foreground">{cats.length} categories, {parents.length} top-level</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { setForm({ name: "", slug: "", parent: "None", icon: "📁", status: "active" }); setAddOpen(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Category
        </Button>
      </div>

      {/* Tree view */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="col-span-5">Name</span>
            <span className="col-span-2">Slug</span>
            <span className="col-span-2">Products</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {parents.map((parent) => (
            <div key={parent.id}>
              {/* Parent row */}
              <motion.div whileHover={{ backgroundColor: "hsl(var(--muted) / 0.4)" }}
                className="grid grid-cols-12 items-center px-4 py-3.5 transition-colors group">
                <div className="col-span-5 flex items-center gap-2.5">
                  <span className="text-lg">{parent.icon}</span>
                  <span className="font-semibold text-foreground text-sm">{parent.name}</span>
                  {cats.some((c) => c.parent === parent.name) && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <div className="col-span-2 font-mono text-xs text-muted-foreground">{parent.slug}</div>
                <div className="col-span-2 text-sm text-foreground">{parent.products}</div>
                <div className="col-span-1"><StatusBadge status={parent.status} /></div>
                <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(parent)}><Edit className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteItem(parent)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </motion.div>
              {/* Children */}
              {cats.filter((c) => c.parent === parent.name).map((child) => (
                <motion.div key={child.id} whileHover={{ backgroundColor: "hsl(var(--muted) / 0.4)" }}
                  className="grid grid-cols-12 items-center px-4 py-3 bg-muted/10 transition-colors group">
                  <div className="col-span-5 flex items-center gap-2.5 pl-8">
                    <Tag className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{child.name}</span>
                  </div>
                  <div className="col-span-2 font-mono text-xs text-muted-foreground">{child.slug}</div>
                  <div className="col-span-2 text-sm text-foreground">{child.products}</div>
                  <div className="col-span-1"><StatusBadge status={child.status} /></div>
                  <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(child)}><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteItem(child)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <AdminModal open={addOpen} onClose={() => setAddOpen(false)} title="Add Category"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button><Button size="sm" onClick={handleAdd}>Add Category</Button></div>}>
        <FormFields />
      </AdminModal>
      <AdminModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Category"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button><Button size="sm" onClick={handleEdit}>Save</Button></div>}>
        <FormFields />
      </AdminModal>
      <ConfirmDialog open={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
        title="Delete Category" message={`Remove "${deleteItem?.name}"? Child categories may be affected.`} confirmLabel="Delete" />
    </motion.div>
  );
}
