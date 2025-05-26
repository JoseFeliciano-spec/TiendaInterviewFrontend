import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiLoader,
  FiArrowLeft,
  FiShoppingCart,
  FiStar,
  FiAlertCircle,
  FiTruck,
  FiShield,
  FiZap,
} from "react-icons/fi";
import {
  useProductBySlug,
  type SearchedProduct,
} from "@/hooks/products/useProductSearch";
import { toast } from "react-hot-toast";

export function ProductPage() {
  const { id } = useParams<{ id: string }>(); // Obtener slug de la URL
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] =
    useState<SearchedProduct | null>(null);

  // Obtener query adicional de URL params si existe
  const queryFromUrl = id || "";

  // React Query para buscar productos
  const {
    data: searchData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProductBySlug(queryFromUrl);

  console.log(searchData);

  // Effect para manejar el primer producto encontrado
  useEffect(() => {
    if (searchData && searchData.products.length > 0) {
      const firstProduct = searchData.products[0];
      setSelectedProduct(firstProduct);
    }
  }, [searchData, navigate, id]);

  // Funciones de utilidad
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product: SearchedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    // Integrar con Redux/Zustand según especificaciones del test
    console.log("Adding to cart:", product);
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header con breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <motion.button
                whileHover={{ x: -2 }}
                onClick={handleBackToProducts}
                className="flex items-center space-x-1 text-[#00825A] hover:text-[#00825A]/80 transition-colors"
              >
                <FiArrowLeft size={16} />
                <span className="hidden sm:inline">Productos</span>
              </motion.button>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:inline text-[#2C2A29] font-medium">
                Búsqueda
              </span>
            </nav>

            {isFetching && (
              <FiLoader className="animate-spin text-[#00825A]" size={18} />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2A29] mb-2">
            Resultados de búsqueda
          </h1>
          <p className="text-gray-600">
            Buscando:{" "}
            <span className="font-semibold text-[#00825A]">
              "{queryFromUrl}"
            </span>
          </p>
        </motion.div>

        {/* Estados de carga, error y contenido */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLoader className="animate-spin text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2A29] mb-2">
                Buscando productos...
              </h3>
              <p className="text-gray-600">
                Estamos encontrando los mejores resultados para ti
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2A29] mb-2">
                Error en la búsqueda
              </h3>
              <p className="text-gray-600 mb-6">
                {error?.message || "Ocurrió un error inesperado"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Reintentar búsqueda
              </motion.button>
            </motion.div>
          ) : !selectedProduct ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2A29] mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                No hay productos que coincidan con tu búsqueda "{queryFromUrl}"
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToProducts}
                className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Ver todos los productos
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="product-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Producto encontrado */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Imagen del producto */}
                  <div className="relative">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {selectedProduct.featured && (
                        <span className="bg-[#DFFF61] text-[#2C2A29] px-3 py-1 rounded-lg text-sm font-bold">
                          ⭐ Destacado
                        </span>
                      )}
                      {selectedProduct.discount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                          -{selectedProduct.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Stock indicator */}
                    {selectedProduct.stock < 10 && (
                      <div className="absolute bottom-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        Solo {selectedProduct.stock} disponibles
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={16}
                                className={
                                  i < Math.floor(selectedProduct.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                            reseñas)
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mb-2">
                          {selectedProduct.name}
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#B0F2AE]/20 text-[#00825A] px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Precios */}
                      <div className="bg-gradient-to-r from-[#00825A]/5 to-[#B0F2AE]/5 rounded-xl p-4">
                        <div className="flex items-baseline space-x-3 mb-3">
                          <span className="text-2xl sm:text-3xl font-bold text-[#00825A]">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          {selectedProduct.originalPrice && (
                            <div className="flex flex-col">
                              <span className="text-lg text-gray-400 line-through">
                                {formatPrice(selectedProduct.originalPrice)}
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                Ahorras{" "}
                                {formatPrice(
                                  selectedProduct.originalPrice -
                                    selectedProduct.price
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Beneficios */}
                        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                          <div className="flex flex-col items-center text-center">
                            <FiTruck
                              className="text-[#00825A] mb-1"
                              size={16}
                            />
                            <span className="text-gray-700 font-medium">
                              Envío gratis
                            </span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <FiShield
                              className="text-[#00825A] mb-1"
                              size={16}
                            />
                            <span className="text-gray-700 font-medium">
                              Garantía
                            </span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <FiZap className="text-[#00825A] mb-1" size={16} />
                            <span className="text-gray-700 font-medium">
                              Entrega 24h
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleAddToCart(selectedProduct, e)}
                        className="w-full border-2 border-[#00825A] text-[#00825A] py-4 rounded-xl font-semibold text-lg hover:bg-[#00825A] hover:text-white transition-all flex items-center justify-center space-x-2"
                      >
                        <FiShoppingCart size={20} />
                        <span>Agregar al carrito</span>
                      </motion.button>
                    </div>

                    {/* Stock info */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Disponibilidad:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedProduct.stock > 10
                              ? "bg-green-500"
                              : selectedProduct.stock > 0
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            selectedProduct.stock > 10
                              ? "text-green-600"
                              : selectedProduct.stock > 0
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedProduct.stock > 0
                            ? `${selectedProduct.stock} en stock`
                            : "Agotado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje informativo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#00825A]/5 border border-[#00825A]/20 rounded-xl p-4 text-center"
              >
                <p className="text-[#00825A] font-medium">
                  Este es el primer resultado para tu búsqueda. ¿Buscas algo más
                  específico?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackToProducts}
                  className="mt-2 text-[#00825A] hover:text-[#00825A]/80 font-semibold underline transition-colors"
                >
                  Ver todos los productos
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
