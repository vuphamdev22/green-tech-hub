import { Dispatch, RefObject, SetStateAction, memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import DataTable, { Column } from "../components/DataTable";
import type { AdminCategory } from "@/services/adminCategoryService";
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory, type CategoryManagementPayload } from "@/services/adminCategoryService";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

type CategoryFormState = {
  name: string;
  description: string;
  icon: string;
  status: "ACTIVE" | "INACTIVE";
};

const initialFormState: CategoryFormState = {
  name: "",
  description: "",
  icon: "📁",
  status: "ACTIVE",
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCategory | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const resetForm = () => setForm({ ...initialFormState });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (addOpen || editItem) {
      nameInputRef.current?.focus();
    }
  }, [addOpen, editItem]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminCategories();
      setCategories(res.data);
    } catch (err) {
      setError("Không thể load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name) {
      setError("Tên category bắt buộc");
      return;
    }
    try {
      const payload: CategoryManagementPayload = {
        name: form.name,
        description: form.description,
        icon: form.icon,
        status: form.status,
      };
      const res = await createAdminCategory(payload);
      setCategories((c) => [res.data, ...c]);
      setAddOpen(false);
      resetForm();
    } catch (err) {
      setError("Không thể tạo category");
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    try {
      const payload: CategoryManagementPayload = {
        name: form.name,
        description: form.description,
        icon: form.icon,
        status: form.status,
      };
      const res = await updateAdminCategory(editItem.id, payload);
      setCategories((c) => c.map((x) => (x.id === editItem.id ? res.data : x)));
      setEditItem(null);
      resetForm();
    } catch (err) {
      setError("Không thể cập nhật category");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteAdminCategory(deleteItem.id);
      setCategories((c) => c.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    } catch (err) {
      setError("Không thể xóa category");
      console.error(err);
    }
  };

  const openEdit = (cat: AdminCategory) => {
    setEditItem(cat);
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      icon: cat.icon ?? "📁",
      status: cat.status ?? "ACTIVE",
    });
  };

  const columns: Column<AdminCategory>[] = [
    {
      key: "name",
      label: "Category",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.icon ?? "📁"}</span>
          <div className="font-medium text-foreground text-sm">{row.name}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (row) => (
        <p className="text-xs text-muted-foreground max-w-xs truncate">{row.description || "-"}</p>
      ),
    },
    {
      key: "productCount",
      label: "Products",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-primary">{row.productCount ?? 0}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.status === "ACTIVE" ? "active" : "inactive"} />
      ),
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading categories...</div>;
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Categories</h1>
          <p className="text-xs text-muted-foreground">{categories.length} total categories</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => { resetForm(); setAddOpen(true); }}>
          <Plus className="w-3.5 h-3.5" /> Add Category
        </Button>
      </div>

      {error && <div className="text-destructive font-semibold text-sm">{error}</div>}

      <DataTable
        data={categories}
        columns={columns}
        searchKeys={["name", "description"]}
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

      <AdminModal key="add-category" open={addOpen} onClose={() => setAddOpen(false)} title="Add New Category" size="md"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button><Button size="sm" onClick={handleAdd}><Package className="w-3.5 h-3.5 mr-1" />Add Category</Button></div>}>
        <CategoryFormFields form={form} setForm={setForm} nameInputRef={nameInputRef} />
      </AdminModal>

      <AdminModal key={`edit-category-${editItem?.id || "none"}`} open={!!editItem} onClose={() => setEditItem(null)} title="Edit Category" size="md"
        footer={<div className="flex gap-2 justify-end"><Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button><Button size="sm" onClick={handleEdit}>Save Changes</Button></div>}>
        <CategoryFormFields form={form} setForm={setForm} nameInputRef={nameInputRef} />
      </AdminModal>

    <ConfirmDialog open={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
      title="Delete Category" message={`Remove "${deleteItem?.name}" permanently?`} confirmLabel="Delete" />
  </motion.div>
);
}

interface CategoryFormFieldsProps {
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
  nameInputRef: RefObject<HTMLInputElement>;
}

const CategoryFormFields = memo(function CategoryFormFields({ form, setForm, nameInputRef }: CategoryFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-medium mb-1.5">Category Name</div>
          <input
            ref={nameInputRef}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="e.g. Laptops"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <div className="text-xs font-medium mb-1.5">Icon</div>
          <input
            value={form.icon}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="📁"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground text-center text-lg"
          />
        </div>
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Description</div>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Mô tả ngắn về category"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Status</div>
        <select
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as "ACTIVE" | "INACTIVE" }))}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>
  );
});
