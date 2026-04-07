import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { categoryRevenueData } from "../data/adminMockData";
import { getAdminStats, getRevenueData, getTopProducts, getRecentOrders } from "../../services/adminDashboardService";
import { cn } from "@/lib/utils";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };
const periods = ["Monthly", "Weekly", "Daily"];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("Monthly");
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryRevenueShare = useMemo(() => {
    const total = categoryRevenueData.reduce((sum, item) => sum + item.value, 0);
    return categoryRevenueData.map((item) => ({
      ...item,
      percent: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, revenueRes, topProductsRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getRevenueData(),
          getTopProducts(),
          getRecentOrders()
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data.data);
        setTopProducts(topProductsRes.data.products);
        setRecentOrders(ordersRes.data.orders);
      } catch (err) {
        setError("Không thể tải dữ liệu analytics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-xs text-muted-foreground">Performance overview</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats ? (
          <>
            <KpiCard index={0} title="Total Revenue" value={stats.revenue.value} prefix="$" change={stats.revenue.change} period={stats.revenue.period} icon={<DollarSign className="w-4 h-4" />} />
            <KpiCard index={1} title="Total Orders" value={stats.orders.value} change={stats.orders.change} period={stats.orders.period} icon={<ShoppingCart className="w-4 h-4" />} />
            <KpiCard index={2} title="Total Users" value={stats.users.value} change={stats.users.change} period={stats.users.period} icon={<Users className="w-4 h-4" />} />
            <KpiCard index={3} title="Total Products" value={stats.products.value} change={stats.products.change} period={stats.products.period} icon={<Package className="w-4 h-4" />} />
          </>
        ) : (
          <div className="col-span-4 text-center py-8">Loading stats...</div>
        )}
      </div>

      {/* Revenue + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Revenue over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Top Products</h3>
          <p className="text-xs text-muted-foreground mb-4">Best performing products</p>
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <span className="text-sm font-medium text-foreground">{product.name}</span>
                </div>
                <span className="text-sm font-semibold text-primary">${product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders bar + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{order.customer}</span>
                  <span className="text-xs text-muted-foreground">{order.id}</span>
                </div>
                <span className="text-sm font-semibold text-primary">${order.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category Revenue Share */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1 bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Share</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenueShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={92}
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                  stroke="transparent"
                >
                  {categoryRevenueShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2 grid gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="bg-card border border-border/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {categoryRevenueShare.map((category) => (
                <div key={category.name} className="rounded-2xl border border-border/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase text-muted-foreground">{category.name}</span>
                    <span className="text-sm font-semibold text-foreground">{category.percent}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${category.percent}%`, backgroundColor: category.color }} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">${category.value.toLocaleString()} revenue</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Products Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-card border border-border/50 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                {["Rank", "Product", "Units Sold", "Revenue", "Stock"].map((h) => (
                  <th key={h} className="pb-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 px-3 text-muted-foreground">{p.sales.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-primary">${p.revenue.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={p.stock < 15 ? "text-yellow-500 font-semibold" : "text-muted-foreground"}>{p.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
        </>
      )}
    </motion.div>
  );
}
