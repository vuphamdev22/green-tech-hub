import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight, Shield, Truck, Zap, RefreshCw } from "lucide-react";
import heroLaptop from "@/assets/hero-laptop.png";
import { categories } from "@/data/mockData";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import { useProducts } from "@/hooks/useProducts";

const stats = [
  { value: "50K+", label: "Products" },
  { value: "2.4M", label: "Customers" },
  { value: "99.8%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

const perks = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over $99" },
  { icon: Shield, label: "2-Year Warranty", desc: "On all hardware" },
  { icon: RefreshCw, label: "30-Day Returns", desc: "Hassle-free" },
  { icon: Zap, label: "Same-Day Dispatch", desc: "Order before 2PM" },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { products, loading, error } = useProducts();

  const parseTimestamp = (value?: string) => {
    const timestamp = value ? Date.parse(value) : 0;
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const featuredProducts = products?.slice(0, 6) ?? [];
  const newArrivals = products
    ? [...products]
        .sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt))
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-carbon-900"
      >
        {/* Grid bg */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Glow orb */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div style={{ opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
              >
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand border border-brand/30 bg-brand/10 px-3 py-1.5 rounded-sm mb-6">
                  <Zap className="w-3 h-3" fill="currentColor" />
                  New: RTX 5090 Series In Stock
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0, 0, 1] }}
                className="text-5xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-foreground mb-6"
              >
                PEAK
                <br />
                <span className="text-gradient-brand">PERFORMANCE</span>
                <br />
                HARDWARE.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.2, 0, 0, 1] }}
                className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed"
              >
                Engineered for professionals. Built for gamers. The next generation of
                computing starts here — 7,400MB/s sequential read, zero compromise.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.2, 0, 0, 1] }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-carbon-900 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all duration-200 rounded-sm hover:scale-[1.02]"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?category=components"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/15 text-foreground font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all duration-200 rounded-sm"
                >
                  Build Your PC
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/5"
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-mono-spec font-black text-2xl text-brand">{s.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero image */}
            <motion.div
              style={{ y: heroY }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.2, 0, 0, 1] }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-brand/15 blur-[100px] rounded-full scale-75" />
              <motion.img
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                src={heroLaptop}
                alt="High-end gaming laptop"
                className="relative z-10 w-full max-w-xl drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PERKS BAR ── */}
      <section className="border-y border-white/5 bg-carbon-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-5">
                <Icon className="w-5 h-5 text-brand flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand font-bold mb-2">
              Browse by Category
            </p>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Find Your Gear
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-brand transition-colors"
          >
            All products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.2, 0, 0, 1] }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="flex flex-col items-center gap-3 p-5 bg-card border border-white/[0.06] rounded-md hover:border-brand/30 hover:bg-card/80 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  {cat.icon}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-foreground group-hover:text-brand transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono-spec mt-0.5">
                    {cat.count} items
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand font-bold mb-2">
              Hand-picked
            </p>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-brand transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {error && (
          <p className="text-sm text-destructive mt-2">
            Unable to load featured products: {error}
          </p>
        )}
        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No featured products available right now.
          </p>
        )}
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="relative overflow-hidden rounded-md bg-gradient-to-r from-carbon-800 to-carbon-700 border border-brand/20 p-10 md:p-16 grid-pattern"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand font-black border border-brand/30 bg-brand/10 px-3 py-1 rounded-sm inline-block mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              UP TO{" "}
              <span className="text-gradient-brand">40% OFF</span>
              <br />
              RTX 5000 SERIES
            </h2>
            <p className="text-muted-foreground mb-8">
              Next-gen DLSS 4 performance. Upgrade now before stock runs out.
            </p>
            <Link
              to="/products?category=components"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand text-carbon-900 font-black uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity"
            >
              Shop GPUs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand font-bold mb-2">
              Just Landed
            </p>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              New Arrivals
            </h2>
          </div>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No new arrivals at the moment.
          </p>
        )}
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-carbon-800 border border-white/5 rounded-md p-8 md:p-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand font-bold mb-3">
            Stay in the Loop
          </p>
          <h2 className="text-3xl font-black tracking-tight text-foreground mb-3">
            Get Early Access to Deals
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join 250,000+ tech enthusiasts. Be first to know about flash sales, new
            arrivals, and exclusive drops.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-carbon-700 border border-white/10 rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
