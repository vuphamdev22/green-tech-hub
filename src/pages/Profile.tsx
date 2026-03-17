import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Truck,
} from "lucide-react";
import { products } from "@/data/mockData";

const mockOrders = [
  {
    id: "ORD-9241",
    date: "Mar 10, 2025",
    status: "Delivered",
    items: [products[0]],
    total: 2499,
  },
  {
    id: "ORD-8815",
    date: "Feb 28, 2025",
    status: "Shipped",
    items: [products[3], products[4]],
    total: 1388,
  },
  {
    id: "ORD-7703",
    date: "Jan 15, 2025",
    status: "Delivered",
    items: [products[5]],
    total: 149,
  },
];

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  Delivered: "text-brand bg-brand/10 border-brand/20",
  Shipped: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Processing: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            {/* Avatar card */}
            <div className="bg-card border border-white/[0.06] rounded-md p-6 mb-4 text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-3 text-brand font-black text-2xl">
                A
              </div>
              <h2 className="font-black text-foreground">Alex Reynolds</h2>
              <p className="text-xs text-muted-foreground mt-0.5">alex@example.com</p>
              <div className="mt-3 text-[10px] text-brand border border-brand/30 bg-brand/10 px-2 py-1 rounded-sm inline-block uppercase tracking-widest font-bold">
                Pro Member
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-card border border-white/[0.06] rounded-md overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-2 ${
                    activeTab === id
                      ? "bg-brand/10 text-brand border-brand"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                </button>
              ))}
              <div className="border-t border-white/5">
                <Link
                  to="/login"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main>
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
                  Dashboard
                </h1>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Orders", value: "12" },
                    { label: "Total Spent", value: "$8,240" },
                    { label: "Wishlist", value: "7 items" },
                    { label: "Reward Points", value: "8,240 pts" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-card border border-white/[0.06] rounded-md p-4"
                    >
                      <div className="font-mono-spec text-2xl font-black text-brand">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent order */}
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Recent Orders
                </h2>
                <div className="space-y-3">
                  {mockOrders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="bg-card border border-white/[0.06] rounded-md p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={order.items[0].image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono-spec text-xs font-bold text-foreground">
                            {order.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="font-mono-spec font-black text-foreground">
                        ${order.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
                  Order History
                </h1>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card border border-white/[0.06] rounded-md p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono-spec font-black text-foreground">
                              {order.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusColors[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Truck className="w-3 h-3" /> {order.date}
                          </p>
                        </div>
                        <span className="font-mono-spec font-black text-foreground text-xl">
                          ${order.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {order.items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/products/${item.id}`}
                            className="flex items-center gap-2 p-2 bg-carbon-800 rounded-sm hover:bg-carbon-700 transition-colors"
                          >
                            <div className="w-10 h-10 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs text-foreground max-w-[120px] truncate">
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
                  Saved Addresses
                </h1>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Home",
                      address: "123 Main Street, Apt 4B",
                      city: "New York, NY 10001",
                      default: true,
                    },
                    {
                      label: "Office",
                      address: "456 Tech Avenue, Floor 12",
                      city: "San Francisco, CA 94105",
                      default: false,
                    },
                  ].map((addr) => (
                    <div
                      key={addr.label}
                      className={`bg-card border rounded-md p-5 ${
                        addr.default ? "border-brand/30" : "border-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                          {addr.label}
                        </span>
                        {addr.default && (
                          <span className="text-[10px] text-brand border border-brand/30 bg-brand/10 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.address}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}</p>
                      <div className="flex gap-3 mt-4">
                        <button className="text-xs text-brand hover:underline">Edit</button>
                        <button className="text-xs text-muted-foreground hover:text-red-400 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="border border-dashed border-white/10 rounded-md p-5 text-muted-foreground hover:text-foreground hover:border-brand/30 transition-colors text-sm font-bold text-center">
                    + Add New Address
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">
                  Account Settings
                </h1>
                <div className="bg-card border border-white/[0.06] rounded-md p-6 space-y-4 max-w-lg">
                  {[
                    { label: "First Name", value: "Alex", type: "text" },
                    { label: "Last Name", value: "Reynolds", type: "text" },
                    { label: "Email", value: "alex@example.com", type: "email" },
                    { label: "Phone", value: "+1 (555) 012-3456", type: "tel" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full bg-carbon-700 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand/50 transition-colors"
                      />
                    </div>
                  ))}
                  <button className="px-6 py-2.5 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
