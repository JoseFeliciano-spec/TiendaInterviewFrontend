"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiStar,
  FiTruck,
  FiShield,
  FiCheck,
  FiMinus,
  FiPlus,
  FiCreditCard,
  FiShare2,
  FiZap,
  FiArrowLeft,
  FiEye,
  FiClock
} from 'react-icons/fi';

interface ProductReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  features: string[];
  specifications: { [key: string]: string };
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
  stock: number;
  featured: boolean;
  discount?: number;
}

export function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [viewingImage, setViewingImage] = useState(false);

  // Producto único simplificado
  const mockProduct: Product = {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    description: "El smartphone más avanzado con chip A17 Pro, cámara profesional de 48MP y diseño en titanio",
    longDescription: "El iPhone 15 Pro Max redefine lo que es posible en un smartphone. Con el revolucionario chip A17 Pro fabricado en 3 nanómetros, ofrece un rendimiento sin precedentes. Su sistema de cámaras profesional con lente principal de 48MP te permite capturar momentos con una calidad excepcional, mientras que el diseño en titanio aeroespacial proporciona durabilidad y elegancia sin igual.",
    brand: "Apple",
    category: "Smartphones",
    price: 4999999,
    originalPrice: 5499999,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    features: [
      "Chip A17 Pro de 3 nanómetros - El más potente en un smartphone",
      "Cámara principal de 48MP con zoom óptico 5x",
      "Pantalla Super Retina XDR de 6.7 pulgadas con ProMotion",
      "Diseño en titanio aeroespacial - Ligero y resistente",
      "Batería de hasta 29 horas de reproducción de video",
      "Resistencia al agua IP68 - Sumergible hasta 6 metros"
    ],
    specifications: {
      "Pantalla": "6.7\" Super Retina XDR OLED",
      "Procesador": "Chip A17 Pro (3nm)",
      "Almacenamiento": "256GB",
      "Cámara": "48MP principal + 12MP ultra gran angular",
      "Batería": "Hasta 29 horas de video",
      "Peso": "221 gramos",
      "Conectividad": "5G, WiFi 6E, Bluetooth 5.3",
      "Resistencia": "IP68 (6m por 30min)"
    },
    reviews: [
      {
        id: 1,
        user: "María González",
        rating: 5,
        comment: "Increíble calidad de cámara y rendimiento excepcional. La batería dura fácilmente todo el día con uso intensivo.",
        date: "15 Ene 2025",
        verified: true
      },
      {
        id: 2,
        user: "Carlos Rodríguez",
        rating: 5,
        comment: "El diseño en titanio se siente premium y es notablemente más ligero. Excelente inversión.",
        date: "10 Ene 2025",
        verified: true
      },
      {
        id: 3,
        user: "Ana Martínez",
        rating: 4,
        comment: "Fantástico teléfono, aunque el precio es elevado. La calidad justifica la inversión.",
        date: "5 Ene 2025",
        verified: true
      }
    ],
    averageRating: 4.8,
    totalReviews: 324,
    stock: 15,
    featured: true,
    discount: 9
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setProduct(mockProduct);
      setLoading(false);
    };
    loadProduct();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (operation: 'increase' | 'decrease') => {
    if (operation === 'increase' && product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (operation === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4 animate-pulse">
              <div className="w-full h-96 sm:h-[500px] bg-gray-200 rounded-3xl"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <head>
        <title>{product.name} - TiendaApp | Compra Segura con tienda</title>
        <meta name="description" content={`${product.description}. Stock disponible: ${product.stock} unidades. Compra segura con tienda. ${product.originalPrice ? `Ahorra ${formatPrice(product.originalPrice - product.price)}` : ''}`} />
        <meta name="keywords" content={`${product.name}, ${product.brand}, ${product.category}, smartphone, comprar, tienda, pago seguro`} />
        <meta property="og:title" content={`${product.name} - TiendaApp`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <link rel="canonical" href={`https://tiendaapp.com/producto/${product.id}`} />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Breadcrumb simplificado */}
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <motion.button
                  whileHover={{ x: -2 }}
                  className="flex items-center space-x-1 text-[#00825A] hover:text-[#00825A]/80"
                  onClick={() => window.history.back()}
                >
                  <FiArrowLeft size={16} />
                  <span className="hidden sm:inline">Volver</span>
                </motion.button>
                <span className="hidden sm:inline">/</span>
                <span className="hidden sm:inline text-[#2C2A29] font-medium">{product.category}</span>
              </nav>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FiHeart 
                  size={18} 
                  className={isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}
                />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galería de Imágenes Mejorada */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Imagen Principal */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden group">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.gallery[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 sm:h-[500px] object-cover cursor-zoom-in"
                  onClick={() => setViewingImage(true)}
                />
                
                {/* Badges flotantes */}
                <div className="absolute top-6 left-6 flex flex-col space-y-2">
                  {product.featured && (
                    <motion.span
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="bg-[#DFFF61] text-[#2C2A29] px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center space-x-1"
                    >
                      <FiStar size={14} />
                      <span>Destacado</span>
                    </motion.span>
                  )}
                  {product.discount && (
                    <motion.span
                      initial={{ scale: 0, rotate: 10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
                    >
                      -{product.discount}% OFF
                    </motion.span>
                  )}
                </div>

                {/* Indicador de stock */}
                {product.stock < 10 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-6 bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg flex items-center space-x-2"
                  >
                    <FiClock size={14} />
                    <span>Solo {product.stock} disponibles</span>
                  </motion.div>
                )}

                {/* Botón de zoom */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewingImage(true)}
                  className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <FiEye size={18} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Miniaturas mejoradas */}
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.gallery.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all ${
                      currentImageIndex === index 
                        ? 'border-[#00825A] shadow-lg ring-2 ring-[#00825A]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Información del Producto Optimizada */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header con brand y rating */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-[#B0F2AE] to-[#99D1FC] text-[#00825A] px-4 py-2 rounded-xl text-sm font-bold">
                    {product.brand}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <FiShare2 size={18} className="text-gray-500" />
                  </motion.button>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold text-[#2C2A29] leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        className={i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-[#2C2A29] font-semibold">{product.averageRating}</span>
                  <span className="text-gray-500">({product.totalReviews} reseñas)</span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pricing destacado */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-[#00825A]/5 to-[#B0F2AE]/5 rounded-2xl p-6 border border-[#00825A]/10"
              >
                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-3xl sm:text-5xl font-bold text-[#00825A]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        Ahorras {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Beneficios */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex flex-col items-center text-center">
                    <FiTruck className="text-[#00825A] mb-1" size={20} />
                    <span className="text-gray-700 font-medium">Envío gratis</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FiShield className="text-[#00825A] mb-1" size={20} />
                    <span className="text-gray-700 font-medium">12 meses garantía</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FiZap className="text-[#00825A] mb-1" size={20} />
                    <span className="text-gray-700 font-medium">Entrega 24h</span>
                  </div>
                </div>
              </motion.div>

              {/* Cantidad simplificada */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#2C2A29]">Cantidad</h3>
                  <span className="text-sm text-gray-600">
                    {product.stock} disponibles
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-100 rounded-xl">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-3 text-gray-600 hover:text-[#00825A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiMinus size={18} />
                    </motion.button>
                    <span className="px-6 py-3 font-bold text-[#2C2A29] text-lg">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                      className="p-3 text-gray-600 hover:text-[#00825A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiPlus size={18} />
                    </motion.button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Total: <span className="font-bold text-[#00825A] text-lg">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción mejorados */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 130, 90, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <FiCreditCard size={22} />
                  <span>Comprar Ahora - Pago Seguro</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={product.stock === 0}
                  className="w-full border-2 border-[#00825A] text-[#00825A] py-5 rounded-2xl font-semibold text-lg hover:bg-[#00825A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <FiShoppingCart size={20} />
                  <span>Agregar al Carrito</span>
                </motion.button>
              </div>

              {/* Stock indicator mejorado */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Disponibilidad:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      product.stock > 10 ? 'bg-green-500' : 
                      product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <span className={`font-semibold ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Secciones adicionales simplificadas */}
          <div className="mt-16 space-y-8">
            {/* Características principales */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A29] mb-8 text-center">
                ¿Por qué elegir este producto?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-full flex items-center justify-center">
                      <FiCheck className="text-white" size={18} />
                    </div>
                    <span className="text-gray-700 leading-relaxed font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Reseñas destacadas */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#00825A]/5 to-[#B0F2AE]/5 rounded-3xl p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A29] mb-4">
                  Lo que dicen nuestros clientes
                </h2>
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={20}
                        className={i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-[#2C2A29]">{product.averageRating}</span>
                  <span className="text-gray-600">de {product.totalReviews} reseñas</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="bg-[#B0F2AE] text-[#00825A] px-2 py-1 rounded-lg text-xs font-bold">
                          Verificada
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#2C2A29]">{review.user}</span>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Modal de imagen ampliada */}
        <AnimatePresence>
          {viewingImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setViewingImage(false)}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={product.gallery[currentImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setViewingImage(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de pago placeholder */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPaymentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-[#2C2A29] mb-4 text-center">
                  🚀 Proceso de Pago
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Aquí se implementará el flujo completo de pago con tienda según las especificaciones del test.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Continuar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
