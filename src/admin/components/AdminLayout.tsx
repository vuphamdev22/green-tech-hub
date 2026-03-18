import { useState, ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useLocation } from "react-router-dom";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/products": "Product Management",
  "/admin/categories": "Category Management",
  "/admin/orders": "Order Management",
  "/admin/users": "User Management",
  "/admin/vouchers": "Voucher & Promotions",
  "/admin/inventory": "Inventory Management",
  "/admin/reviews": "Review Management",
  "/admin/analytics": "Analytics & Reports",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = titleMap[location.pathname] || "Admin";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminNavbar onMenuToggle={() => setCollapsed((c) => !c)} title={title} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
