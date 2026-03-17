import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Zap,
  ChevronDown,
  User,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { categories } from "@/data/mockData";

const navLinks = [
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Desktops", href: "/products?category=desktops" },
  { label: "Components", href: "/products?category=components" },
  { label: "Gaming", href: "/products?category=gaming" },
  { label: "Monitors", href: "/products?category=monitors" },
  { label: "Peripherals", href: "/products?category=peripherals" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const count = useCartStore((s) => s.count());
  const setCartOpen = useCartStore((s) => s.setOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-carbon-800/95 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-carbon-900" fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter text-foreground">
                VOLT<span className="text-brand">GEAR</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm">
                  Categories <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {categoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-carbon-700 border border-white/10 rounded-md shadow-2xl overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${cat.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground font-mono-spec">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand text-carbon-900 text-[10px] font-black rounded-full flex items-center justify-center leading-none"
                    style={{ width: 18, height: 18 }}
                  >
                    {count}
                  </motion.span>
                )}
              </button>

              {/* Profile */}
              <Link
                to="/login"
                className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors rounded-sm"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-carbon-800 border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/5 pt-2 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-sm transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-carbon-700 border border-white/10 rounded-md shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-4">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, GPUs, peripherals..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                <kbd className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10 font-mono-spec">
                  ESC
                </kbd>
              </form>
              <div className="border-t border-white/5 px-4 py-2">
                <p className="text-xs text-muted-foreground">
                  Popular: RTX 5090, Gaming Laptop, Mechanical Keyboard
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
