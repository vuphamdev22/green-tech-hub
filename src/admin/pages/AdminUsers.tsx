import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Lock, Unlock, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { AdminUser } from "@/types/user";
import { getAdminUsers, setAdminUserEnabled, deleteAdminUser } from "@/services/adminUserService";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [toggleUser, setToggleUser] = useState<AdminUser | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (err: any) {
      toast({ title: "Lỗi tải users", description: err?.response?.data?.message || "Không lấy được users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ["all", "ADMIN", "USER"];
  const filtered = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  const handleEnableToggle = async () => {
    if (!toggleUser) return;
    try {
      const newEnabled = !toggleUser.enabled;
      const res = await setAdminUserEnabled(toggleUser.id, newEnabled);
      setUsers((prev) => prev.map((u) => (u.id === res.data.id ? res.data : u)));
      toast({ title: "Thành công", description: `User đã ${newEnabled ? "kích hoạt" : "khóa"}` });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Không thể đổi trạng thái", variant: "destructive" });
    } finally {
      setToggleUser(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast({ title: "Đã xóa", description: `User ${user.email} đã bị xóa` });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Không thể xóa", variant: "destructive" });
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
            row.enabled ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
          )}>
            {row.firstName?.[0] ?? "U"}{row.lastName?.[0] ?? "S"}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row) => <span className="text-xs text-muted-foreground">{row.phone ?? "-"}</span> },
    { key: "role", label: "Role", render: (row) => <StatusBadge status={row.role.toLowerCase()} /> },
    { key: "orderCount", label: "Orders", sortable: true, render: (row) => <span className="font-semibold text-foreground">{row.orderCount}</span> },
    { key: "totalSpent", label: "Total Spent", sortable: true, render: (row) => <span className="font-semibold text-primary">${row.totalSpent.toLocaleString()}</span> },
    { key: "enabled", label: "Status", render: (row) => <StatusBadge status={row.enabled ? "active" : "locked"} /> },
    { key: "createdAt", label: "Joined", sortable: true, render: (row) => <span className="text-xs text-muted-foreground">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span> },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Users</h1>
          <p className="text-xs text-muted-foreground">{users.length} registered users</p>
        </div>
        <div className="flex gap-2">
          {statusOptions.map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                roleFilter === role ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:bg-muted")}>
              {role === "all" ? "All" : role.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        isLoading={loading}
        data={filtered}
        columns={columns}
        searchKeys={["firstName", "lastName", "email", "phone"]}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setViewUser(row)}>
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7", row.enabled ? "text-muted-foreground hover:text-destructive" : "text-yellow-500 hover:text-primary")}
              onClick={() => setToggleUser(row)}>
              {row.enabled ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(row)}>
              <Users className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      />

      <AdminModal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="lg">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-lg flex items-center justify-center">
                {viewUser.firstName?.[0] ?? "U"}{viewUser.lastName?.[0] ?? "S"}
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{viewUser.firstName} {viewUser.lastName}</p>
                <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={viewUser.role.toLowerCase()} />
                  <StatusBadge status={viewUser.enabled ? "active" : "locked"} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone", value: viewUser.phone || "-" },
                { label: "Joined", value: viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : "-" },
                { label: "Total Orders", value: String(viewUser.orderCount) },
                { label: "Total Spent", value: `$${viewUser.totalSpent.toLocaleString()}` },
              ].map((f) => (
                <div key={f.label} className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold text-foreground">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!toggleUser}
        onConfirm={handleEnableToggle}
        onCancel={() => setToggleUser(null)}
        title={toggleUser?.enabled ? "Disable user?" : "Enable user?"}
        message={`${toggleUser?.enabled ? "Disable" : "Enable"} account for ${toggleUser?.firstName} ${toggleUser?.lastName}?`}
        confirmLabel={toggleUser?.enabled ? "Disable" : "Enable"}
        danger={toggleUser?.enabled}
      />
    </motion.div>
  );
}
