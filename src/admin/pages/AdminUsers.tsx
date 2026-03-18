import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Lock, Unlock, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "../components/DataTable";
import AdminModal from "../components/AdminModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import { adminUsers } from "../data/adminMockData";
import { cn } from "@/lib/utils";

type User = typeof adminUsers[0];
const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

export default function AdminUsers() {
  const [users, setUsers] = useState(adminUsers);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [lockUser, setLockUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  const handleLockToggle = () => {
    if (!lockUser) return;
    setUsers((prev) => prev.map((u) => u.id === lockUser.id
      ? { ...u, status: u.status === "active" ? "locked" : "active" } : u));
    setLockUser(null);
  };

  const columns: Column<User>[] = [
    {
      key: "name", label: "User", sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
            row.status === "locked" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
          )}>
            {row.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row) => <span className="text-xs text-muted-foreground">{row.phone}</span> },
    { key: "role", label: "Role", render: (row) => <StatusBadge status={row.role} /> },
    { key: "orders", label: "Orders", sortable: true, render: (row) => <span className="font-semibold text-foreground">{row.orders}</span> },
    { key: "spent", label: "Total Spent", sortable: true, render: (row) => <span className="font-semibold text-primary">${row.spent.toLocaleString()}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "joined", label: "Joined", sortable: true, render: (row) => <span className="text-xs text-muted-foreground">{row.joined}</span> },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Users</h1>
          <p className="text-xs text-muted-foreground">{users.length} registered users</p>
        </div>
        <div className="flex gap-2">
          {["all", "customer", "admin"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                roleFilter === r ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:bg-muted")}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Users", value: users.length, icon: <Users className="w-4 h-4" />, color: "text-primary" },
          { label: "Active", value: users.filter((u) => u.status === "active").length, icon: <Search className="w-4 h-4" />, color: "text-primary" },
          { label: "Locked", value: users.filter((u) => u.status === "locked").length, icon: <Lock className="w-4 h-4" />, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl bg-muted flex items-center justify-center", s.color)}>{s.icon}</div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["name", "email"]}
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => setViewUser(row)}>
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("h-7 w-7", row.status === "active" ? "text-muted-foreground hover:text-destructive" : "text-yellow-500 hover:text-primary")}
              onClick={() => setLockUser(row)}>
              {row.status === "active" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </Button>
          </>
        )}
      />

      {/* User Detail */}
      <AdminModal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="lg">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary font-bold text-lg flex items-center justify-center">
                {viewUser.avatar}
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{viewUser.name}</p>
                <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={viewUser.role} />
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Phone", value: viewUser.phone },
                { label: "Member Since", value: viewUser.joined },
                { label: "Total Orders", value: String(viewUser.orders) },
                { label: "Total Spent", value: `$${viewUser.spent.toLocaleString()}` },
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
        open={!!lockUser}
        onConfirm={handleLockToggle}
        onCancel={() => setLockUser(null)}
        title={lockUser?.status === "active" ? "Lock User Account?" : "Unlock User Account?"}
        message={`${lockUser?.status === "active" ? "Lock" : "Unlock"} account for ${lockUser?.name}?`}
        confirmLabel={lockUser?.status === "active" ? "Lock Account" : "Unlock Account"}
        danger={lockUser?.status === "active"}
      />
    </motion.div>
  );
}
