import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import userService from "@/services/userService";
import authService from "@/services/authService";
import tokenService from "@/services/tokenService";
import orderService from "@/services/orderService";
import type { UserProfile } from "@/types/user";
import type { OrderResponse } from "@/types/order";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  DELIVERED: "text-brand bg-brand/10 border-brand/20",
  SHIPPED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  PROCESSING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

const getStatusClass = (status: string) =>
  statusColors[status.toUpperCase()] ?? "text-white/80 border-white/10 bg-white/5";

const detailFields = [
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "address", label: "Address", icon: MapPin },
  { key: "role", label: "Role", icon: ShieldCheck },
];

type SavedAddress = {
  label: string;
  address: string;
  city: string;
  default: boolean;
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    userService
      .getProfile()
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
        }
      })
      .catch(() => {
        toast.error("Session expired, please log in again");
        navigate("/login", { replace: true });
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await orderService.getOrders();
        if (isMounted) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
        toast.error("Có lỗi khi tải đơn hàng");
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };
    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Could not sign out right now");
    } finally {
      tokenService.clearTokens();
      navigate("/", { replace: true });
    }
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Volt User";
  const initial = user?.firstName?.[0] ?? "U";
  const savedAddresses: SavedAddress[] = [
    user?.address
      ? {
          label: "Primary",
          address: user.address,
          city: "Registered Location",
          default: true,
        }
      : null,
    {
      label: "Tech HQ",
      address: "456 Tech Avenue, Floor 12",
      city: "San Francisco, CA 94105",
      default: !user?.address,
    },
  ].filter(Boolean) as SavedAddress[];

  const getDetailValue = (key: string) => {
    if (!user) {
      return "—";
    }
    switch (key) {
      case "email":
        return user.email;
      case "phone":
        return user.phone || "—";
      case "address":
        return user.address || "Not provided";
      case "role":
        return user.role;
      default:
        return "—";
    }
  };

  const totalOrders = orders.length;
const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalItemsOrdered = orders.reduce(
    (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
    0
  );
  const pendingOrders = orders.filter((order) => order.status.toUpperCase() === "PENDING").length;
  const overviewOrders = orders.slice(0, 2);
  const formatOrderDate = (value?: string) => value ?? "Unknown time";

  return (
    <div className="min-h-screen pt-20 bg-carbon-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-card border border-white/[0.06] rounded-md p-6 mb-4 text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-3 text-gradient-brand font-black text-2xl">
                {initial}
              </div>
              <h2 className="font-black text-foreground line-clamp-1">{fullName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email ?? "—"}</p>
              <div className="mt-3 text-[10px] text-brand border border-brand/30 bg-brand/10 px-2 py-1 rounded-sm inline-block uppercase tracking-widest font-bold">
                {user?.role ?? "Guest"}
              </div>
            </div>

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
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden relative"
            >
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-carbon-900/80">
                  <Loader2 className="w-10 h-10 text-brand animate-spin" />
                </div>
              )}

              <div className="px-6 py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">Profile</p>
                  <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
                    <User className="w-6 h-6 text-brand" />
                    {fullName}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage your account information, security, and settings.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-1 border border-white/10 rounded-full">
                    {user?.role ?? "Guest"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-brand px-4 py-2 rounded-full shadow-lg hover:bg-brand/80 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>

              <div className="px-6 py-8 relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Orders", value: totalOrders.toString() },
                    {
                      label: "Total Spent",
                      value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                    },
                    { label: "Items Ordered", value: totalItemsOrdered.toString() },
                    { label: "Pending Orders", value: pendingOrders.toString() },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-carbon-900/80 border border-white/[0.06] rounded-md p-4"
                    >
                      <div className="font-mono-spec text-2xl font-black text-brand">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 mb-10">
                  {detailFields.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="bg-carbon-900/80 border border-white/[0.06] rounded-xl p-5 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
                        <p className="text-base font-semibold text-foreground">{getDetailValue(key)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Recent Orders
                    </h2>
                    <div className="space-y-3">
                      {ordersLoading && (
                        <p className="text-xs text-muted-foreground">Loading recent orders…</p>
                      )}
                      {overviewOrders.length > 0 ? (
                        overviewOrders.map((order) => {
                          const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                          const previewItem = order.items[0];
                          return (
                            <div
                              key={order.orderId}
                              className="bg-carbon-900/70 border border-white/[0.06] rounded-md p-4 flex items-center gap-4"
                            >
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-carbon-800 flex items-center justify-center text-xs font-black text-muted-foreground">
                                {previewItem?.image ? (
                                  <img
                                    src={previewItem.image}
                                    alt={previewItem.productName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{previewItem?.productName?.charAt(0) ?? "?"}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono-spec text-xs font-bold text-foreground">
                                    VG-{order.orderId}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getStatusClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mb-1">{formatOrderDate(order.createdAt)}</p>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                                </p>
                                <p className="font-mono-spec font-black text-foreground">
                                  ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        !ordersLoading && (
                          <p className="text-xs text-muted-foreground">
                            You haven’t placed any orders yet.
                          </p>
                        )
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "orders" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-black tracking-tight text-foreground">Order History</h1>
                      {ordersLoading && (
                        <span className="text-xs text-muted-foreground">Updating…</span>
                      )}
                    </div>
                    <div className="space-y-4">
                      {orders.length ? (
                        orders.map((order) => (
                          <div key={order.orderId} className="bg-carbon-900/70 border border-white/[0.06] rounded-md p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono-spec font-black text-foreground">VG-{order.orderId}</span>
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${getStatusClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{formatOrderDate(order.createdAt)}</p>
                              </div>
                              <span className="font-mono-spec font-black text-foreground text-xl">
                                ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="grid gap-3">
                              {order.items.map((item) => (
                                <Link
                                  key={`${order.orderId}-${item.productId}`}
                                  to={`/products/${item.productId}`}
                                  className="flex items-center gap-3 p-3 bg-carbon-900/50 rounded-sm hover:bg-carbon-800 transition-colors"
                                >
                                  <div className="w-10 h-10 bg-carbon-900 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-black text-muted-foreground">
                                    {item.image ? (
                                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{item.productName.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-foreground line-clamp-1">{item.productName}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {item.quantity} × ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                  </div>
                                  <span className="font-mono text-xs font-bold text-foreground">
                                    ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          You haven’t placed any orders yet.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "addresses" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Saved Addresses</h1>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.label}
                          className={`bg-carbon-900/70 border rounded-md p-5 ${
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
                    <h1 className="text-2xl font-black tracking-tight text-foreground mb-6">Account Settings</h1>
                    <div className="bg-carbon-900/70 border border-white/[0.06] rounded-md p-6 space-y-4 max-w-lg">
                      {[
                        { label: "First Name", value: user?.firstName ?? "", type: "text" },
                        { label: "Last Name", value: user?.lastName ?? "", type: "text" },
                        { label: "Email", value: user?.email ?? "", type: "email" },
                        { label: "Phone", value: user?.phone ?? "", type: "tel" },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            defaultValue={field.value}
                            className="w-full bg-carbon-800 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand/50 transition-colors"
                          />
                        </div>
                      ))}
                      <button className="px-6 py-2.5 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
