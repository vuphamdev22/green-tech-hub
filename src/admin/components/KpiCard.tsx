import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon: ReactNode;
  prefix?: string;
  index?: number;
}

export default function KpiCard({ title, value, change, period, icon, prefix = "", index = 0 }: KpiCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-primary" : "text-destructive")}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? "+" : ""}{change}% {period}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
