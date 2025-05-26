"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiFilter,
  FiGrid,
  FiList,
  FiStar,
  FiEye,
  FiX,
  FiSearch,
  FiTruck,
  FiShield,
  FiZap,
} from "react-icons/fi";

// Tipos de datos
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de productos con descuentos calculados
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      description:
        "El smartphone más avanzado con chip A17 Pro, cámara profesional de 48MP y pantalla Super Retina XDR",
      price: 4999999,
      originalPrice: 5499999,
      image:
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "smartphones",
      stock: 15,
      rating: 4.9,
      reviews: 324,
      tags: ["premium", "nuevo", "5g"],
      featured: true,
      discount: 9,
    },
    {
      id: 2,
      name: "MacBook Pro 16 M3 Max",
      description:
        "Laptop profesional con chip M3 Max, pantalla Liquid Retina XDR de 16 pulgadas y hasta 22 horas de batería",
      price: 8999999,
      originalPrice: 9999999,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "laptops",
      stock: 8,
      rating: 4.8,
      reviews: 156,
      tags: ["profesional", "m3", "retina"],
      featured: true,
      discount: 10,
    },
    {
      id: 3,
      name: "AirPods Pro 3ra Generación",
      description:
        "Audífonos inalámbricos premium con cancelación activa de ruido adaptativo y audio espacial personalizado",
      price: 899999,
      originalPrice: 1099999,
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "audio",
      stock: 32,
      rating: 4.7,
      reviews: 892,
      tags: ["inalámbrico", "noise-cancelling", "spatial"],
      featured: false,
      discount: 18,
    },
    {
      id: 4,
      name: "iPad Air M2 Wi-Fi 256GB",
      description:
        "Tablet versátil con chip M2 de nueva generación, pantalla Liquid Retina de 10.9 pulgadas y Magic Keyboard",
      price: 2499999,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "tablets",
      stock: 12,
      rating: 4.6,
      reviews: 234,
      tags: ["m2", "liquid-retina", "versatil"],
      featured: false,
    },
    {
      id: 5,
      name: "Samsung Galaxy S24 Ultra 512GB",
      description:
        "Smartphone Galaxy con S Pen integrado, cámara AI de 200MP y pantalla Dynamic AMOLED 2X de 6.8 pulgadas",
      price: 4299999,
      originalPrice: 4799999,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "smartphones",
      stock: 20,
      rating: 4.5,
      reviews: 445,
      tags: ["s-pen", "200mp", "amoled"],
      featured: true,
      discount: 10,
    },
    {
      id: 6,
      name: "Sony WH-1000XM5 Wireless",
      description:
        "Audífonos premium over-ear con la mejor cancelación de ruido del mercado y 30 horas de batería",
      price: 1299999,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "audio",
      stock: 18,
      rating: 4.8,
      reviews: 567,
      tags: ["premium", "noise-cancelling", "sony"],
      featured: false,
    },
  ];

  const categories = [
    { id: "all", name: "Todos", count: mockProducts.length, icon: "🛍️" },
    {
      id: "smartphones",
      name: "Smartphones",
      count: mockProducts.filter((p) => p.category === "smartphones").length,
      icon: "📱",
    },
    {
      id: "laptops",
      name: "Laptops",
      count: mockProducts.filter((p) => p.category === "laptops").length,
      icon: "💻",
    },
    {
      id: "tablets",
      name: "Tablets",
      count: mockProducts.filter((p) => p.category === "tablets").length,
      icon: "📟",
    },
    {
      id: "audio",
      name: "Audio",
      count: mockProducts.filter((p) => p.category === "audio").length,
      icon: "🎧",
    },
  ];

  // Simulación de carga
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProducts(mockProducts);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // Filtrado y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [products, selectedCategory, priceRange, sortBy, searchTerm]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section Optimizado */}
        <section className="bg-[#00825A] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">
                Productos Premium
              </h1>
              <p className="text-base sm:text-xl opacity-90 max-w-2xl mx-auto px-4">
                La mejor tecnología con envío gratis y garantía extendida
              </p>

              {/* Trust badges móvil */}
              <div className="flex items-center justify-center space-x-4 mt-6 text-sm">
                <div className="flex items-center space-x-1">
                  <FiTruck size={16} />
                  <span className="hidden sm:inline">Envío Gratis</span>
                  <span className="sm:hidden">Gratis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiShield size={16} />
                  <span className="hidden sm:inline">Garantía</span>
                  <span className="sm:hidden">Seguro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiZap size={16} />
                  <span className="hidden sm:inline">Entrega Rápida</span>
                  <span className="sm:hidden">Rápido</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar Móvil Optimizado */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="fixed inset-0 z-50 lg:hidden"
                >
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setShowFilters(false)}
                  />
                  <div className="relative w-80 h-full bg-white shadow-2xl overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#2C2A29]">
                          Filtros
                        </h2>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* Búsqueda Móvil */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Buscar
                        </label>
                        <div className="relative">
                          <FiSearch
                            className="absolute left-3 top-3 text-gray-400"
                            size={16}
                          />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar productos..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00825A] focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Categorías Móvil */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#2C2A29] mb-3 uppercase tracking-wider">
                          Categorías
                        </h3>
                        <div className="space-y-1">
                          {categories.map((category) => (
                            <motion.button
                              key={category.id}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                                selectedCategory === category.id
                                  ? "bg-[#00825A] text-white shadow-lg"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{category.icon}</span>
                                <span>{category.name}</span>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  selectedCategory === category.id
                                    ? "bg-white/20"
                                    : "bg-gray-200"
                                }`}
                              >
                                {category.count}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Rango de Precios Móvil */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#2C2A29] mb-3 uppercase tracking-wider">
                          Precio Máximo
                        </h3>
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="0"
                            max="10000000"
                            step="100000"
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([
                                priceRange[0],
                                parseInt(e.target.value),
                              ])
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00825A]"
                          />
                          <div className="text-center">
                            <span className="text-lg font-bold text-[#00825A]">
                              {formatPrice(priceRange[1])}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-80">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#2C2A29] mb-6">
                  Filtros
                </h2>

                {/* Búsqueda Desktop */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar productos
                  </label>
                  <div className="relative">
                    <FiSearch
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00825A] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categorías Desktop */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#2C2A29] mb-4">
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          selectedCategory === category.id
                            ? "bg-[#00825A] text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            selectedCategory === category.id
                              ? "bg-white/20"
                              : "bg-gray-200"
                          }`}
                        >
                          {category.count}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Rango de Precios Desktop */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2C2A29] mb-4">
                    Rango de Precios
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-[#00825A]"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span className="font-bold text-[#00825A]">
                        {formatPrice(priceRange[1])}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 min-w-0">
              {/* Barra de herramientas móvil optimizada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-[#00825A] text-white rounded-xl hover:bg-[#00825A]/90 transition-colors text-sm font-medium"
                  >
                    <FiFilter size={16} />
                    <span>Filtros</span>
                  </button>

                  <p className="text-[#2C2A29] font-medium text-sm sm:text-base">
                    <span className="font-bold text-[#00825A]">
                      {filteredAndSortedProducts.length}
                    </span>{" "}
                    productos
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  {/* Ordenamiento */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00825A] focus:border-transparent bg-white"
                  >
                    <option value="featured">Destacados</option>
                    <option value="price-low">Menor precio</option>
                    <option value="price-high">Mayor precio</option>
                    <option value="rating">Mejor valorados</option>
                    <option value="newest">Más recientes</option>
                  </select>

                  {/* Vista */}
                  <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-[#00825A]"
                          : "text-gray-500"
                      }`}
                    >
                      <FiGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-[#00825A]"
                          : "text-gray-500"
                      }`}
                    >
                      <FiList size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Grid de Productos Optimizado */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-48 sm:h-56 bg-gray-200"></div>
                      <div className="p-4 sm:p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid gap-4 sm:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredAndSortedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        {/* Imagen del producto optimizada */}
                        <div
                          className={`relative ${
                            viewMode === "list"
                              ? "w-32 sm:w-48 flex-shrink-0"
                              : "w-full h-48 sm:h-56"
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />

                          {/* Badges optimizados */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {product.featured && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-[#DFFF61] text-[#2C2A29] px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
                              >
                                ⭐ Top
                              </motion.span>
                            )}
                            {product.discount && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
                              >
                                -{product.discount}%
                              </motion.span>
                            )}
                          </div>

                          {/* Botón de favoritos mejorado */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all"
                          >
                            <FiHeart
                              size={16}
                              className={
                                favorites.includes(product.id)
                                  ? "text-red-500 fill-current"
                                  : "text-gray-400"
                              }
                            />
                          </motion.button>

                          {/* Indicador de stock bajo */}
                          {product.stock < 10 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg"
                            >
                              Solo {product.stock}
                            </motion.div>
                          )}
                        </div>

                        {/* Información del producto optimizada */}
                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                          {/* Rating compacto */}
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={12}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-600 font-medium">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>

                          {/* Nombre con line-clamp-1 */}
                          <h3 className="text-base sm:text-lg font-bold text-[#2C2A29] mb-2 line-clamp-1">
                            {product.name}
                          </h3>

                          {/* Descripción con line-clamp-2 */}
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 flex-1">
                            {product.description}
                          </p>

                          {/* Tags compactos */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {product.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#B0F2AE]/20 text-[#00825A] px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Precios mejorados */}
                          <div className="flex items-baseline space-x-2 mb-4">
                            <span className="text-xl sm:text-2xl font-bold text-[#00825A]">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Botones de acción optimizados */}
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                            >
                              <FiShoppingCart size={16} />
                              <span className="hidden sm:inline">Agregar</span>
                              <span className="sm:hidden">Comprar</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-3 border-2 border-[#00825A] text-[#00825A] rounded-xl hover:bg-[#00825A] hover:text-white transition-all duration-300"
                            >
                              <FiEye size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Estado sin productos mejorado */}
              {!loading && filteredAndSortedProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 sm:py-16"
                >
                  <div className="max-w-md mx-auto px-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#B0F2AE] to-[#99D1FC] rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiSearch size={32} className="text-[#00825A]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2A29] mb-2">
                      No encontramos productos
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                      Prueba ajustando los filtros o cambiando los términos de
                      búsqueda
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([0, 5000000]);
                        setSearchTerm("");
                      }}
                      className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Limpiar filtros
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
