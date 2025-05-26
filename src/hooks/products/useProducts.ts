import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number; // En centavos
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  featured: boolean;
  discount?: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductResponse {
  attributes: ProductAttributes;
}

interface ProductsApiResponse {
  success: boolean;
  data: {
    products: ProductResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  statusCode: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // En pesos (convertido de centavos)
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  featured: boolean;
  discount?: number;
  sku: string;
  slug: string; // Para navegación
}

interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Función para convertir nombre a slug
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Reemplazar múltiples guiones con uno solo
    .trim();
};

const mapProductResponse = (apiProduct: ProductResponse): Product => {
  const { attributes } = apiProduct;
  return {
    id: attributes.id,
    name: attributes.name,
    description: attributes.description,
    price: attributes.price / 100, // Convertir de centavos a pesos
    originalPrice: attributes.originalPrice
      ? attributes.originalPrice / 100
      : undefined,
    image: attributes.image,
    category: attributes.category,
    stock: attributes.stock,
    rating: attributes.rating,
    reviews: attributes.reviews,
    tags: attributes.tags,
    featured: attributes.featured,
    discount: attributes.discount,
    sku: attributes.sku,
    slug: createSlug(attributes.name), // Crear slug para navegación
  };
};

const fetchProducts = async (
  params: ProductsQueryParams = {}
): Promise<{
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.category && params.category !== "all")
    queryParams.append("category", params.category);
  if (params.featured) queryParams.append("featured", "true");
  if (params.search) queryParams.append("search", params.search);
  if (params.minPrice)
    queryParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice)
    queryParams.append("maxPrice", params.maxPrice.toString());

  const dataLocal: ProductsApiResponse = await axios.get(
    `/api/v1/products?${queryParams.toString()}`
  );

  const data = dataLocal?.data;
  
  if (!dataLocal?.success) {
    throw new Error("Failed to fetch products");
  }

  return {
    products: data?.products.map(mapProductResponse),
    total: data?.total,
    page: data?.page,
    limit: data?.limit,
    totalPages: data?.totalPages,
    hasNext: data?.hasNext,
    hasPrev: data?.hasPrev,
  };
};

// React Query Hook
export const useProducts = (params: ProductsQueryParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook para productos destacados (para página principal)
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ featured: true, limit: 6 }),
    staleTime: 10 * 60 * 1000, // 10 minutos para productos destacados
    retry: 3,
  });
};
