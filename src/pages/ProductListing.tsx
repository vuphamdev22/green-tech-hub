import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Grid3X3, List } from "lucide-react";
import { products, categories } from "@/data/mockData";
import type { Product } from "@/data/mockData";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const priceRanges = [
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200 – $500", min: 200, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "$1,000 – $2,500", min: 1000, max: 2500 },
  { label: "Over $2,500", min: 2500, max: Infinity },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let result = [...products];

      if (activeCategory !== "all") {
        result = result.filter((p) => p.category === activeCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (priceRange) {
        result = result.filter(
          (p) => p.price >= priceRange.min && p.price <= priceRange.max
        );
      }

      switch (sort) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }

      setFiltered(result);
      setPage(1);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sort, priceRange]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const setCategory = (cat: string) => {
    if (cat === "all") searchParams.delete("category");
    else searchParams.set("category", cat);
    setSearchParams(searchParams);
  };

  const activeLabel =
    activeCategory === "all"
      ? "All Products"
      : categories.find((c) => c.id === activeCategory)?.name ?? "Products";

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-carbon-800/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {activeLabel}
                {searchQuery && (
                  <span className="text-muted-foreground"> for "{searchQuery}"</span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {loading ? "Loading..." : `${filtered.length} results`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-carbon-700 border border-white/10 rounded-sm px-3 py-2 pr-8 text-sm text-foreground outline-none focus:border-brand/50 cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {/* View toggle */}
              <div className="flex border border-white/10 rounded-sm overflow-hidden">
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 transition-colors ${
                      viewMode === mode
                        ? "bg-brand text-carbon-900"
                        : "bg-carbon-700 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode === "grid" ? (
                      <Grid3X3 className="w-4 h-4" />
                    ) : (
                      <List className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
              {/* Mobile filters */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-white/10 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:border-brand/30 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory("all")}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                activeCategory === "all"
                  ? "bg-brand text-carbon-900"
                  : "bg-white/5 text-muted-foreground hover:text-foreground border border-white/10"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
                  activeCategory === cat.id
                    ? "bg-brand text-carbon-900"
                    : "bg-white/5 text-muted-foreground hover:text-foreground border border-white/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar filters */}
          <AnimatePresence>
            {(filtersOpen || true) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${
                  filtersOpen ? "block" : "hidden lg:block"
                } bg-card border border-white/[0.06] rounded-md p-5 h-fit sticky top-24`}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4 flex items-center justify-between">
                  Filters
                  {priceRange && (
                    <button
                      onClick={() => setPriceRange(null)}
                      className="text-brand text-[10px] flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </h3>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-1.5">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setPriceRange(
                            priceRange?.min === range.min ? null : { min: range.min, max: range.max }
                          )
                        }
                        className={`w-full text-left text-xs px-3 py-2 rounded-sm transition-colors ${
                          priceRange?.min === range.min
                            ? "bg-brand/20 text-brand border border-brand/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Availability
                  </h4>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    <input type="checkbox" className="accent-brand w-3.5 h-3.5" />
                    In Stock Only
                  </label>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div>
            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-bold text-foreground mb-2">No results found</p>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-8 py-3 border border-white/15 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-brand/30 hover:bg-white/5 rounded-sm transition-all"
                    >
                      Load More ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
