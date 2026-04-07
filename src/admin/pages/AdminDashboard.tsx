import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../components/KpiCard";
import StatusBadge from "../components/StatusBadge";
import AdminModal from "../components/AdminModal";
import { getAdminStats, getRevenueData, getTopProducts, getRecentOrders, type AdminStats, type RevenueData, type TopProduct, type AdminOrder } from "../../services/adminDashboardService";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -12 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [topProds, setTopProds] = useState<TopProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, topRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getRevenueData(),
          getTopProducts(),
          getRecentOrders(),
        ]);
        setStats(statsRes.data);
        setRevenue(revenueRes.data.data);
        setTopProds(topRes.data.products);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!stats) {
    return <div className="flex justify-center items-center h-64">Error loading data</div>;
  }
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard index={0} title="Total Revenue" value={stats.revenue.value} prefix="$"
          change={stats.revenue.change} period={stats.revenue.period}
          icon={<DollarSign className="w-4 h-4" />} />
        <KpiCard index={1} title="Total Orders" value={stats.orders.value}
          change={stats.orders.change} period={stats.orders.period}
          icon={<ShoppingCart className="w-4 h-4" />} />
        <KpiCard index={2} title="Total Users" value={stats.users.value}
          change={stats.users.change} period={stats.users.period}
          icon={<Users className="w-4 h-4" />} />
        <KpiCard index={3} title="Total Products" value={stats.products.value}
          change={stats.products.change} period={stats.products.period}
          icon={<Package className="w-4 h-4" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="xl:col-span-2 bg-card border border-border/50 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue and orders</p>
            </div>
            <select className="text-xs bg-muted border-0 rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProds.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.sales} units sold</p>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">${(p.revenue / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Monthly Orders Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-card border border-border/50 rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-card border border-border/50 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Orders</h3>
          <a href="/admin/orders" className="text-xs text-primary hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["Order ID", "Customer", "Product", "Amount", "Status", "Date", ""].map((h) => (
                  <th key={h} className="pb-3 px-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr 
                  key={o.id} 
                  onClick={() => navigate('/admin/orders')}
                  className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-2 font-mono text-xs text-primary">{o.id}</td>
                  <td className="py-3 px-2 text-foreground font-medium text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                        {o.customer
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0].toUpperCase())
                          .join("")}
                      </div>
                      <span className="truncate">{o.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground text-xs truncate max-w-[140px]">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 shrink-0" />
                      <span className="truncate">{o.product}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-foreground font-semibold text-xs">${o.amount.toLocaleString()}</td>
                  <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{o.date}</td>
                  <td className="py-3 px-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewOrder(o);
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AdminModal
        open={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title={`Order Details - ${viewOrder?.id}`}
      >
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Customer</label>
                <p className="text-sm">{viewOrder.customer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{viewOrder.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Product</label>
                <p className="text-sm">{viewOrder.product}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="text-sm font-semibold">${viewOrder.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <StatusBadge status={viewOrder.status} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-sm">{viewOrder.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Items</label>
                <p className="text-sm">{viewOrder.items}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </motion.div>
  );
}
