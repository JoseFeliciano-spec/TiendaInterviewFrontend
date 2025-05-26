// hooks/useProductSearch.ts
import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';

// Interfaces basadas en tu API real
interface SearchProductResponse {
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
}

interface SearchApiResponse {
  success: boolean;
  data: {
    products: SearchProductResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
  statusCode: number;
}

// Interfaz para el frontend (convertir precios)
export interface SearchedProduct {
  id: string;
  name: string;
  description: string;
  price: number; // En pesos
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  featured: boolean;
  discount?: number;
  slug: string; // Para navegación
}

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Función para crear slug según especificaciones del test
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres especiales
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones
    .replace(/^-|-$/g, '') // Remover guiones al inicio/final
    .trim();
};

// API function para búsqueda
const searchProducts = async (params: SearchParams): Promise<{
  products: SearchedProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('q', params.query);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.category) queryParams.append('category', params.category);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

  const data: SearchApiResponse = await axios.get(
    `/api/v1/products/search?${queryParams.toString()}`
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to search products');
  }

  return {
    products: data.data.products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price / 100, // Convertir de centavos a pesos
      originalPrice: product.originalPrice ? product.originalPrice / 100 : undefined,
      image: product.image,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      tags: product.tags,
      featured: product.featured,
      discount: product.discount,
      slug: createSlug(product.name), // Crear slug para navegación
    })),
    total: data.data.total,
    page: data.data.page,
    limit: data.data.limit,
    totalPages: data.data.totalPages,
    hasNext: data.data.hasNext,
    hasPrev: data.data.hasPrev,
  };
};

// Hook principal de búsqueda
export const useProductSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ['product-search', params],
    queryFn: () => searchProducts(params),
    enabled: !!params.query && params.query.length >= 2, // Solo buscar si hay query válido
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook específico para buscar por slug y mostrar el primer resultado
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product-by-slug', slug],
    queryFn: () => searchProducts({ query: slug}),
    enabled: !!slug && slug.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos para productos específicos
    retry: 3,
  });
};
