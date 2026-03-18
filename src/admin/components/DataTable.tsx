import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  actions?: (row: T) => ReactNode;
}

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchable = true,
  searchKeys = [],
  pageSize = 8,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = data.filter((row) => {
    if (!search) return true;
    return searchKeys.some((k) => {
      const val = String(row[k] ?? "").toLowerCase();
      return val.includes(search.toLowerCase());
    });
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="space-y-3">
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 bg-muted border-0 focus-visible:ring-1 text-sm"
          />
        </div>
      )}

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      col.sortable && "cursor-pointer hover:text-foreground select-none",
                      col.className
                    )}
                    onClick={() => col.sortable && toggleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <span className="flex flex-col ml-0.5">
                          <ChevronUp className={cn("w-2.5 h-2.5 -mb-0.5", sortKey === col.key && sortDir === "asc" ? "text-primary" : "opacity-30")} />
                          <ChevronDown className={cn("w-2.5 h-2.5", sortKey === col.key && sortDir === "desc" ? "text-primary" : "opacity-30")} />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {paged.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className={cn("px-4 py-3 text-foreground", col.className)}>
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[String(col.key)] ?? "-")}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="text-muted-foreground text-xs px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors",
                        currentPage === p ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
