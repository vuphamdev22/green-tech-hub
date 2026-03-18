import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package, Eye } from "lucide-react";
import KpiCard from "../components/KpiCard";
import StatusBadge from "../components/StatusBadge";
import { adminStats, revenueData, topProducts, adminOrders } from "../data/adminMockData";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -12 },
};

export default function AdminDashboard() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard index={0} title="Total Revenue" value={adminStats.revenue.value} prefix="$"
          change={adminStats.revenue.change} period={adminStats.revenue.period}
          icon={<DollarSign className="w-4 h-4" />} />
        <KpiCard index={1} title="Total Orders" value={adminStats.orders.value}
          change={adminStats.orders.change} period={adminStats.orders.period}
          icon={<ShoppingCart className="w-4 h-4" />} />
        <KpiCard index={2} title="Total Users" value={adminStats.users.value}
          change={adminStats.users.change} period={adminStats.users.period}
          icon={<Users className="w-4 h-4" />} />
        <KpiCard index={3} title="Total Products" value={adminStats.products.value}
          change={adminStats.products.change} period={adminStats.products.period}
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
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
            {topProducts.map((p, i) => (
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
          <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
              {adminOrders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-primary">{o.id}</td>
                  <td className="py-3 px-2 text-foreground font-medium text-xs">{o.customer}</td>
                  <td className="py-3 px-2 text-muted-foreground text-xs truncate max-w-[140px]">{o.product}</td>
                  <td className="py-3 px-2 text-foreground font-semibold text-xs">${o.amount.toLocaleString()}</td>
                  <td className="py-3 px-2"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{o.date}</td>
                  <td className="py-3 px-2">
                    <button className="text-muted-foreground hover:text-primary transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
