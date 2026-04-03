import { useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Zap, Eye } from "lucide-react";
import {
  getProductCategoryName,
  getProductImage,
  isProductInStock,
  type Product,
} from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { getErrorMessage, getHttpStatus } from "@/utils/error";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available || isAdding) return;

    try {
      setIsAdding(true);
      await addItem(product);
      toast.success(`${product.name} added to cart`, {
        description: `$${product.price.toLocaleString()}`,
        action: { label: "View Cart", onClick: () => setOpen(true) },
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not add this product to your cart."));
      if (getHttpStatus(err) === 403) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  const heroImage = getProductImage(product);
  const categoryName = getProductCategoryName(product);
  const ratingValue = typeof product.rating === "number" ? product.rating : null;
  const reviewCount = typeof product.reviews === "number" ? product.reviews : null;
  const specs = product.specs ?? {};
  const available = isProductInStock(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0, 0, 1] }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-white/[0.06] rounded-md overflow-hidden hover:border-brand/30 transition-colors duration-300"
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-brand text-carbon-900 rounded-sm">
            {product.badge}
          </span>
        </div>
      )}
      {discount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-black uppercase px-2 py-1 bg-red-500/90 text-white rounded-sm">
            -{discount}%
          </span>
        </div>
      )}
      {!available && (
        <div className="absolute inset-0 z-20 bg-carbon-900/70 flex items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground border border-white/20 px-3 py-1.5 rounded-sm">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[4/3] bg-carbon-900 overflow-hidden relative">
          {!imgError && heroImage ? (
            <img
              src={heroImage}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : heroImage ? (
            <img
              src={heroImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-brand/20" />
            </div>
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Quick view */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/products/${product.id}`}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-foreground hover:bg-brand hover:text-carbon-900 hover:border-brand transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </Link>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
            {categoryName}
          </span>
          {ratingValue !== null && reviewCount !== null ? (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] text-muted-foreground font-mono-spec">
                {ratingValue.toFixed(1)} ({reviewCount.toLocaleString()})
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              No reviews
            </span>
          )}
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Key specs */}
        <div className="mb-3 space-y-0.5">
          {Object.entries(specs)
            .slice(0, 2)
            .map(([key, val]) => (
              <div key={key} className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">{key}</span>
                <span className="text-foreground/70 font-mono-spec truncate ml-2 max-w-[120px]">
                  {val}
                </span>
              </div>
            ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="font-mono-spec text-lg font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2 font-mono-spec">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!available || isAdding}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand text-brand hover:text-carbon-900 border border-brand/30 hover:border-brand text-xs font-bold uppercase tracking-tight rounded-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isAdding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
