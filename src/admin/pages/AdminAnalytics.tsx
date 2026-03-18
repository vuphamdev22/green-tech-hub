import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { revenueData, userGrowthData, categoryRevenueData, adminStats, topProducts } from "../data/adminMockData";
import { cn } from "@/lib/utils";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };
const periods = ["Monthly", "Weekly", "Daily"];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("Monthly");

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

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard index={0} title="Total Revenue" value={adminStats.revenue.value} prefix="$" change={adminStats.revenue.change} period="vs last year" icon={<DollarSign className="w-4 h-4" />} />
        <KpiCard index={1} title="Total Orders" value={adminStats.orders.value} change={adminStats.orders.change} period="vs last year" icon={<ShoppingCart className="w-4 h-4" />} />
        <KpiCard index={2} title="Total Users" value={adminStats.users.value} change={adminStats.users.change} period="vs last year" icon={<Users className="w-4 h-4" />} />
        <KpiCard index={3} title="Products Sold" value={12480} change={18.3} period="vs last year" icon={<Package className="w-4 h-4" />} />
      </div>

      {/* Revenue + User Growth */}
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
          <h3 className="text-sm font-semibold text-foreground mb-1">User Growth</h3>
          <p className="text-xs text-muted-foreground mb-4">Cumulative users over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="newUsers" stroke="hsl(142 76% 65%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Orders bar + Category Pie */}
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
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryRevenueData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {categoryRevenueData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 11 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryRevenueData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-medium text-foreground">${(c.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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
    </motion.div>
  );
}
