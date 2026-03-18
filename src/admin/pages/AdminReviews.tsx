import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { adminReviews } from "../data/adminMockData";
import { cn } from "@/lib/utils";

type Review = typeof adminReviews[0];
const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn("w-3 h-3", s <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState(adminReviews);
  const [deleteItem, setDeleteItem] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? reviews : reviews.filter((r) => r.status === statusFilter);

  const handleApprove = (id: number) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
  const handleReject = (id: number) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
  const handleDelete = () => {
    if (!deleteItem) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const columns: Column<Review>[] = [
    {
      key: "product", label: "Product", sortable: true,
      render: (row) => <span className="text-sm font-medium text-foreground">{row.product}</span>,
    },
    {
      key: "user", label: "User",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
            {row.user.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="text-sm text-foreground">{row.user}</span>
        </div>
      ),
    },
    { key: "rating", label: "Rating", sortable: true, render: (row) => <StarRating rating={row.rating} /> },
    {
      key: "comment", label: "Comment",
      render: (row) => <p className="text-xs text-muted-foreground max-w-xs truncate">{row.comment}</p>,
    },
    { key: "date", label: "Date", sortable: true, render: (row) => <span className="text-xs text-muted-foreground">{row.date}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Reviews</h1>
          <p className="text-xs text-muted-foreground">{reviews.length} total reviews</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-500">{pendingCount} pending review{pendingCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:bg-muted")}>
            {s} ({s === "all" ? reviews.length : reviews.filter((r) => r.status === s).length})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Avg Rating", value: (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1), icon: "⭐", color: "text-yellow-500" },
          { label: "Approved", value: reviews.filter((r) => r.status === "approved").length, icon: "✅", color: "text-primary" },
          { label: "Pending", value: pendingCount, icon: "⏳", color: "text-yellow-500" },
          { label: "Rejected", value: reviews.filter((r) => r.status === "rejected").length, icon: "❌", color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["product", "user"]}
        actions={(row) => (
          <>
            {row.status === "pending" && (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleApprove(row.id)}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleReject(row.id)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setDeleteItem(row)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog open={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
        title="Delete Review" message="Permanently delete this review?" confirmLabel="Delete" />
    </motion.div>
  );
}
