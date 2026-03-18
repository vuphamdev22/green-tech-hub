import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users,
  Ticket, BarChart3, Warehouse, Star, ChevronLeft,
  ChevronRight, Zap, Settings, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Categories", icon: Tag, to: "/admin/categories" },
  { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Vouchers", icon: Ticket, to: "/admin/vouchers" },
  { label: "Inventory", icon: Warehouse, to: "/admin/inventory" },
  { label: "Reviews", icon: Star, to: "/admin/reviews" },
  { label: "Analytics", icon: BarChart3, to: "/admin/analytics" },
];

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-card border-r border-border/50 overflow-hidden z-30 shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-foreground text-sm leading-tight block">VoltGear</span>
                <span className="text-[10px] text-primary font-medium tracking-widest uppercase">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {navItems.map((item) => {
          const isActive = item.to === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.to);
          return (
            <NavLink key={item.to} to={item.to} end={item.to === "/admin"}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-medium group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0 w-[18px] h-[18px]" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 space-y-1 border-t border-border/50 shrink-0">
        <NavLink to="/admin/settings">
          <motion.div
            whileHover={{ x: collapsed ? 0 : 3 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </NavLink>
        <NavLink to="/">
          <motion.div
            whileHover={{ x: collapsed ? 0 : 3 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Back to Store
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </NavLink>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md text-primary-foreground z-50"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </motion.button>
    </motion.aside>
  );
}
