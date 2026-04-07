import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import type { Product } from "@/types/product";
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, type ProductManagementPayload } from "../../services/adminProductService";
import { getAdminCategories, type AdminCategory } from "../../services/adminCategoryService";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

type ProductFormState = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  sku: string;
  badge: string;
  description: string;
  image: string;
  images: string;
  specs: string;
};

const initialFormState: ProductFormState = {
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  sku: "",
  badge: "",
  description: "",
  image: "",
  images: "",
  specs: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [deleteItem, setDeleteItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, catRes] = await Promise.all([getAdminProducts(), getAdminCategories()]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        setError("Không th? load d? li?u s?n ph?m");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (addOpen || editItem) {
      nameInputRef.current?.focus();
    }
  }, [addOpen, editItem]);

  const parseImages = (text: string) => {
    if (!text) return [];
    return text
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const parseSpecs = (text: string) => {
    if (!text) return {} as Record<string, string>;
    return text
      .split(/\n+/)
      .map((line) => line.split(":"))
      .filter(([k, v]) => k && v)
      .reduce((acc, [k, v]) => {
        acc[k.trim()] = v.trim();
        return acc;
      }, {} as Record<string, string>);
  };

  const handleAdd = async () => {
    if (!form.name || !form.categoryId) {
      setError("Tên và Category b?t bu?c");
      return;
    }
    try {
      const payload: ProductManagementPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        originalPrice: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        categoryId: Number(form.categoryId),
        badge: form.badge,
        images: parseImages(form.images).filter(Boolean),
        specs: parseSpecs(form.specs),
      };
      const res = await createAdminProduct(payload);
      setProducts((p) => [res.data, ...p]);
      setAddOpen(false);
      setForm(initialFormState);
    } catch (err) {
      setError("Không th? t?o s?n ph?m");
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    try {
      const payload: ProductManagementPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
        originalPrice: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        categoryId: Number(form.categoryId),
        badge: form.badge,
        images: parseImages(form.images).filter(Boolean),
        specs: parseSpecs(form.specs),
      };
      const res = await updateAdminProduct(editItem.id, payload);
      setProducts((p) => p.map((x) => (x.id === editItem.id ? res.data : x)));
      setEditItem(null);
      setForm(initialFormState);
    } catch (err) {
      setError("Không th? c?p nh?t s?n ph?m");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await deleteAdminProduct(deleteItem.id);
      setProducts((p) => p.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    } catch (err) {
      setError("Không th? xóa s?n ph?m");
      console.error(err);
    }
  };

  const openEdit = (product: Product) => {
    setEditItem(product);
    setForm({
      name: product.name,
      categoryId: String(typeof product.category === "object" && product.category ? product.category.id : product.category),
      price: String(product.price || 0),
      stock: String(product.stock || 0),
      sku: product.sku ?? "",
      badge: product.badge ?? "",
      description: product.description ?? "",
      image: product.image ?? "",
      images: (product.images ?? []).join("\n"),
      specs: product.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : "",
    });
  };

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Product",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.image ? (
              <img src={row.image} alt={row.name} className="w-10 h-10 rounded-md object-cover border border-border" />
            ) : (
              <span className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-sm">No image</span>
            )}
            <div>
              <p className="font-medium text-foreground text-sm">{row.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{row.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        label: "Category",
        sortable: true,
        render: (row) => (typeof row.category === "string" ? row.category : row.category?.name ?? "-"),
      },
      {
        key: "price",
        label: "Price",
        sortable: true,
        render: (row) => <span className="font-semibold text-primary">${(row.price || 0).toLocaleString()}</span>,
      },
      {
        key: "stock",
        label: "Stock",
        sortable: true,
        render: (row) => {
          const stock = row.stock ?? 0;
          const status = stock === 0 ? "out_of_stock" : stock < 10 ? "low_stock" : "active";
          return <span className={status === "out_of_stock" ? "text-destructive font-semibold" : status === "low_stock" ? "text-yellow-500 font-semibold" : "text-foreground"}>{stock}</span>;
        },
      },
      {
        key: "status",
        label: "Status",
        render: (row) => {
          const stock = row.stock ?? 0;
          const status = stock === 0 ? "out_of_stock" : stock < 10 ? "low_stock" : "active";
          return <StatusBadge status={status} />;
        },
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: "Active", count: products.filter((p) => (p.stock ?? 0) > 10).length, color: "text-primary" },
      { label: "Low Stock", count: products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length, color: "text-yellow-500" },
      { label: "Out of Stock", count: products.filter((p) => (p.stock ?? 0) === 0).length, color: "text-destructive" },
    ],
    [products]
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  if (error) {
    return <div className="text-destructive font-semibold">{error}</div>;
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Products</h1>
          <p className="text-xs text-muted-foreground">{products.length} total products</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setForm(initialFormState);
            setAddOpen(true);
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
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

      <AdminModal
        key="add-product"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Product"
        size="xl"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <Package className="w-3.5 h-3.5 mr-1" />Add Product
            </Button>
          </div>
        }
      >
        <ProductFormFields form={form} setForm={setForm} categories={categories} nameInputRef={nameInputRef} />
      </AdminModal>

      <AdminModal
        key={`edit-product-${editItem?.id ?? "new"}`}
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Product"
        size="xl"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleEdit}>
              Save Changes
            </Button>
          </div>
        }
      >
        <ProductFormFields form={form} setForm={setForm} categories={categories} nameInputRef={nameInputRef} />
      </AdminModal>

      <ConfirmDialog
        open={!!deleteItem}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        title="Delete Product"
        message={`Remove "${deleteItem?.name}" permanently?`}
        confirmLabel="Delete"
      />
    </motion.div>
  );
}

interface ProductFormFieldsProps {
  form: ProductFormState;
  setForm: Dispatch<SetStateAction<ProductFormState>>;
  categories: AdminCategory[];
  nameInputRef: RefObject<HTMLInputElement>;
}

function ProductFormFields({ form, setForm, categories, nameInputRef }: ProductFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-medium mb-1.5">Product Name</div>
        <input
          ref={nameInputRef}
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder='e.g. MacBook Pro 16"'
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Category</div>
        <select
          value={form.categoryId}
          onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">Ch?n category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Main Image URL</div>
        <input
          value={form.image}
          onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="https://..."
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Images (newline or comma separated)</div>
        <textarea
          value={form.images}
          onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Specs (key:value per line)</div>
        <textarea
          value={form.specs}
          onChange={(e) => setForm((prev) => ({ ...prev, specs: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Description</div>
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Mô t? ng?n"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-medium mb-1.5">Price ($)</div>
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            onKeyDown={(e) => e.stopPropagation()}
            type="number"
            placeholder="999"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <div className="text-xs font-medium mb-1.5">Stock Quantity</div>
          <input
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
            onKeyDown={(e) => e.stopPropagation()}
            type="number"
            placeholder="0"
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div>
        <div className="text-xs font-medium mb-1.5">Badge</div>
        <input
          value={form.badge}
          onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Ví d?: Best seller"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

