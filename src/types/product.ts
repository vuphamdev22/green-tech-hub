export interface ProductImage {
  id?: number | string;
  imageUrl: string;
}

export interface ProductCategory {
  id?: number | string;
  name?: string;
  description?: string;
  slug?: string;
}

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock?: number;
  rating: number | null;
  reviews: number | null;
  badge?: string | null;
  category?: ProductCategory | string;
  images?: Array<ProductImage | string>;
  image?: string;
  specs?: Record<string, string>;
  createdAt?: string;
  inStock?: boolean;
}

interface NormalizedCategory {
  id?: number | string;
  name: string;
  description?: string;
  slug?: string;
}

export const normalizeCategory = (
  category?: ProductCategory | string
): NormalizedCategory => {
  if (!category) {
    return { name: "" };
  }
  if (typeof category === "string") {
    return { name: category };
  }
  return {
    id: category.id,
    name: category.name ?? "",
    description: category.description,
    slug: category.slug,
  };
};

export const getProductImage = (product: Product) => {
  const candidates = product.images ?? [];
  if (candidates.length > 0) {
    const first = candidates[0];
    if (typeof first === "string") {
      return first;
    }
    if (first && first.imageUrl) {
      return first.imageUrl;
    }
  }
  return product.image ?? "";
};

export const getProductCategoryName = (product: Product) =>
  normalizeCategory(product.category).name;

export const getProductCategoryId = (product: Product) =>
  normalizeCategory(product.category).id;

export const getProductCategorySlug = (product: Product) => {
  const normalized = normalizeCategory(product.category);
  if (normalized.slug) {
    return normalized.slug;
  }
  return normalized.name.toLowerCase().replace(/\s+/g, "-");
};

export const isProductInStock = (product: Product) => {
  if (typeof product.inStock === "boolean") {
    return product.inStock;
  }
  if (typeof product.stock === "number") {
    return product.stock > 0;
  }
  return true;
};
