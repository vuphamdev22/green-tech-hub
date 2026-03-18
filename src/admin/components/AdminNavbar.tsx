import { useState } from "react";
import { Bell, Search, Menu, Sun, Moon, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminNavbarProps {
  onMenuToggle: () => void;
  title: string;
}

export default function AdminNavbar({ onMenuToggle, title }: AdminNavbarProps) {
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New order #ORD-10042 placed", time: "2m ago", unread: true },
    { id: 2, text: "Low stock: Corsair K100 (8 left)", time: "15m ago", unread: true },
    { id: 3, text: "User Carol White has been locked", time: "1h ago", unread: false },
    { id: 4, text: "New review on RTX 4090 FE", time: "3h ago", unread: false },
  ];

  return (
    <header className="h-16 bg-card border-b border-border/50 flex items-center px-4 md:px-6 gap-4 shrink-0 z-20 relative">
      <button onClick={onMenuToggle} className="lg:hidden text-muted-foreground hover:text-foreground">
        <Menu className="w-5 h-5" />
      </button>

      <div className="font-semibold text-foreground hidden md:block">{title}</div>

      <div className="flex-1 max-w-md ml-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1 text-sm"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border font-semibold text-sm flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-xs text-primary cursor-pointer">Mark all read</span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors text-sm border-b border-border/30 last:border-0 ${n.unread ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {n.unread && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />}
                    <div className={n.unread ? "" : "ml-3.5"}>
                      <p className="text-foreground leading-tight">{n.text}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium leading-tight text-foreground">Admin</p>
            <p className="text-[10px] text-muted-foreground">super admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
