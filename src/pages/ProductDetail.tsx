import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Zap,
  Shield,
  Truck,
} from "lucide-react";
import { getProductById } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/shared/ProductCard";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import {
  getProductCategoryName,
  getProductCategorySlug,
  getProductImage,
  isProductInStock,
  type Product,
} from "@/types/product";
import { getErrorMessage, getHttpStatus } from "@/utils/error";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products: allProducts } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const navigate = useNavigate();
  const location = useLocation();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setError("Product not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
        setError(null);
      })
      .catch((err) => {
        setProduct(null);
        setError(err instanceof Error ? err.message : "Failed to load product.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">⚡</p>
          <h1 className="text-2xl font-black text-foreground mb-2">
            {error ? "Something went wrong" : "Product Not Found"}
          </h1>
          <p className="text-muted-foreground mb-4">{error ?? "We couldn’t find that item."}</p>
          <Link to="/products" className="text-brand hover:underline text-sm">
            Browse all products →
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!product || isAdding || !available) return;

    try {
      setIsAdding(true);
      await addItem(product, quantity);
      toast.success(`${quantity}× ${product.name} added to cart`, {
        action: { label: "View Cart", onClick: () => setCartOpen(true) },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add items to your cart."));
      if (getHttpStatus(err) === 403) {
        navigate("/login", { replace: true, state: { from: location.pathname } });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const categoryName = getProductCategoryName(product);
  const heroImage = getProductImage(product);
  const available = isProductInStock(product);
  const ratingValue = typeof product.rating === "number" ? product.rating : null;
  const reviewCount = typeof product.reviews === "number" ? product.reviews : null;
  const specs = product.specs ?? {};
  const categorySlug = getProductCategorySlug(product);

  const related = allProducts
    ? allProducts
        .filter(
          (p) =>
            p.id !== product.id &&
            getProductCategoryName(p).toLowerCase() === categoryName.toLowerCase()
        )
        .slice(0, 4)
    : [];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="bg-carbon-800/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-brand transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              to={`/products?category=${encodeURIComponent(categorySlug)}`}
              className="hover:text-brand capitalize transition-colors"
            >
              {categoryName}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="relative"
          >
            <div className="aspect-square bg-carbon-800 rounded-md overflow-hidden border border-white/[0.06] relative">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Zap className="w-10 h-10" />
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 bg-brand text-carbon-900 rounded-sm">
                    {product.badge}
                  </span>
                </div>
              )}
              {discount && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-black px-3 py-1.5 bg-red-500 text-white rounded-sm">
                    -{discount}%
                  </span>
                </div>
              )}
            </div>
            {/* Glow */}
            <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full -z-10 scale-75" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand font-black border border-brand/30 bg-brand/10 px-2.5 py-1 rounded-sm">
                {categoryName}
              </span>
              {available ? (
                <span className="text-[10px] uppercase tracking-wider text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider text-red-400">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      ratingValue !== null && i < Math.round(ratingValue)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-mono-spec text-muted-foreground">
                {ratingValue !== null
                  ? `${ratingValue.toFixed(1)} (${(reviewCount ?? 0).toLocaleString()} reviews)`
                  : "No reviews yet"}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-mono-spec text-4xl font-black text-foreground">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-mono-spec text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-red-400">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-white/15 rounded-sm overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono-spec text-foreground font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!available || isAdding}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand text-carbon-900 font-black uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAdding ? "Adding…" : "Add to Cart"}
              </button>

              <button className="w-11 h-11 border border-white/15 rounded-sm flex items-center justify-center text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="w-11 h-11 border border-white/15 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-6">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over $99" },
                { icon: Shield, label: "2yr Warranty", sub: "Manufacturer" },
                { icon: Zap, label: "Same-Day", sub: "Order by 2PM" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5 text-brand" />
                  <span className="text-xs font-bold text-foreground">{label}</span>
                  <span className="text-[10px] text-muted-foreground">{sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Specs / Reviews */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-white/5 mb-8">
            {(["specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "specs" ? (
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {Object.entries(specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between items-center px-4 py-3 bg-card border border-white/[0.06] rounded-sm"
                >
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {key}
                  </span>
                  <span className="text-xs font-mono-spec font-bold text-foreground text-right ml-4">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {[
                { author: "Alex R.", rating: 5, text: "Absolutely incredible machine. The performance blew every benchmark I threw at it out of the water.", date: "2 weeks ago" },
                { author: "Sam K.", rating: 5, text: "Build quality is insane. Feels premium in every way. The thermals are surprisingly good too.", date: "1 month ago" },
                { author: "Jordan M.", rating: 4, text: "Almost perfect. The only minor gripe is the fan noise under full load, but for the performance you get, totally acceptable.", date: "1 month ago" },
              ].map((review, i) => (
                <div key={i} className="p-4 bg-card border border-white/[0.06] rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-brand/20 rounded-full flex items-center justify-center text-[10px] font-black text-brand">
                        {review.author[0]}
                      </div>
                      <span className="text-sm font-bold text-foreground">{review.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
