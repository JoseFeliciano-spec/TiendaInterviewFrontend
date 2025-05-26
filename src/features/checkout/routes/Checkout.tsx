import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiCreditCard, 
  FiTruck,
  FiShield,
  FiCheck,
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiHeart,
  FiStar
} from 'react-icons/fi';
import { CheckoutModal } from '../components/CheckoutModal';

// Tipos según especificaciones del test de tienda
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  category: string;
  rating: number;
  reviews: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  tiendaTransactionId?: string;
  productId: number;
  quantity: number;
  createdAt: string;
}

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [completedTransactions, setCompletedTransactions] = useState<Transaction[]>([]);

  // Productos mock siguiendo especificaciones del test de tienda
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      description: "El smartphone más avanzado con chip A17 Pro, cámara profesional de 48MP y diseño en titanio",
      price: 4999999,
      originalPrice: 5499999,
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      stock: 15,
      category: "Smartphones",
      rating: 4.9,
      reviews: 324
    },
    {
      id: 2,
      name: "MacBook Pro 16 M3 Max",
      description: "Laptop profesional con chip M3 Max, pantalla Liquid Retina XDR y hasta 22 horas de batería",
      price: 8999999,
      originalPrice: 9999999,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      stock: 8,
      category: "Laptops",
      rating: 4.8,
      reviews: 156
    },
    {
      id: 3,
      name: "AirPods Pro 3ra Generación",
      description: "Audífonos inalámbricos premium con cancelación activa de ruido adaptativo",
      price: 899999,
      originalPrice: 1099999,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      stock: 32,
      category: "Audio",
      rating: 4.7,
      reviews: 892
    }
  ];

  // Cargar datos del localStorage al iniciar según especificaciones de recovery
  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      
      // Simular carga realística
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Cargar carrito del localStorage para recovery en refresh
      const savedCart = localStorage.getItem('tienda_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      } else {
        // Agregar productos iniciales al carrito para testing del flujo
        const initialCart: CartItem[] = [
          { product: mockProducts[0], quantity: 1 },
          { product: mockProducts[2], quantity: 2 }
        ];
        setCartItems(initialCart);
        localStorage.setItem('tienda_cart', JSON.stringify(initialCart));
      }
      
      // Cargar transacciones completadas para historial
      const savedTransactions = localStorage.getItem('tienda_transactions');
      if (savedTransactions) {
        try {
          setCompletedTransactions(JSON.parse(savedTransactions));
        } catch (error) {
          console.error('Error parsing transactions:', error);
        }
      }
      
      setLoading(false);
    };

    loadCheckoutData();
  }, []);

  // Guardar carrito en localStorage cuando cambie (recovery feature)
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('tienda_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Cálculos según especificaciones exactas del test de tienda
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const baseFee = 5000; // Tarifa base siempre agregada según documento
  const deliveryFee = subtotal > 50000 ? 0 : 8000; // Envío gratis > $50k según especificaciones
  const totalAmount = subtotal + baseFee + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleProductCheckout = (item: CartItem) => {
    setSelectedProduct(item.product);
    setSelectedQuantity(item.quantity);
    setShowCheckoutModal(true);
  };

  // Función faltante: manejo de éxito de checkout según flujo de 5 pasos
  const handleCheckoutSuccess = (transaction: Transaction) => {
    // Paso 5: Actualizar stock del producto según especificaciones
    const updatedProducts = mockProducts.map(product => 
      product.id === selectedProduct?.id 
        ? { ...product, stock: product.stock - selectedQuantity }
        : product
    );

    // Remover producto del carrito tras compra exitosa
    removeFromCart(selectedProduct!.id);

    // Guardar transacción en historial
    const newTransactions = [...completedTransactions, transaction];
    setCompletedTransactions(newTransactions);
    localStorage.setItem('tienda_transactions', JSON.stringify(newTransactions));

    // Cerrar modal y resetear selección
    setShowCheckoutModal(false);
    setSelectedProduct(null);
    
    // Mostrar notificación de éxito (opcional)
    console.log('Transacción completada exitosamente:', transaction);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#00825A] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header del Checkout optimizado para iPhone SE */}
        <header className="bg-white shadow-lg sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ x: -2 }}
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 text-[#00825A] hover:text-[#00825A]/80 transition-colors"
                >
                  <FiArrowLeft size={20} />
                  <span className="font-medium">Volver</span>
                </motion.button>
                
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2C2A29]">
                    Finalizar Compra
                  </h1>
                  <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                  </p>
                </div>
              </div>

              {/* Indicadores de seguridad */}
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-[#00825A]">
                  <FiShield size={16} />
                  <span className="font-medium">Pago Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-[#00825A]">
                  <FiTruck size={16} />
                  <span className="font-medium">Envío Rápido</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {cartItems.length === 0 ? (
            // Carrito vacío
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingCart size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#2C2A29] mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 mb-8">
                Agrega algunos productos para continuar con tu compra
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/productos'}
                className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Explorar Productos
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos en el carrito */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#2C2A29] mb-6 flex items-center space-x-2">
                    <FiShoppingCart size={22} />
                    <span>Productos en tu carrito</span>
                  </h2>

                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all"
                      >
                        {/* Imagen del producto */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                          />
                          {item.product.originalPrice && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              OFERTA
                            </div>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#2C2A29] text-sm sm:text-base line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-1 mb-2">
                            {item.product.description}
                          </p>
                          
                          {/* Rating y categoria */}
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <FiStar size={12} className="text-yellow-400 fill-current" />
                              <span className="text-gray-600">{item.product.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{item.product.category}</span>
                          </div>

                          {/* Precios */}
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="font-bold text-[#00825A] text-sm sm:text-base">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-gray-400 line-through text-xs">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controles de cantidad */}
                        <div className="flex flex-col items-center space-y-3">
                          <div className="flex items-center bg-gray-100 rounded-lg">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-[#00825A] transition-colors"
                            >
                              <FiMinus size={14} />
                            </motion.button>
                            <span className="px-3 py-2 font-semibold text-[#2C2A29] min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-2 text-gray-600 hover:text-[#00825A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              <FiPlus size={14} />
                            </motion.button>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Eliminar del carrito"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Agregar a favoritos"
                            >
                              <FiHeart size={16} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Botón de pago individual - Siguiente flujo de 5 pasos */}
                        <div className="flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleProductCheckout(item)}
                            className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center space-x-2"
                          >
                            <FiCreditCard size={16} />
                            <span className="hidden sm:inline">Pagar</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Productos sugeridos */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-[#2C2A29] mb-4">
                    Productos que podrían interesarte
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockProducts.filter(p => !cartItems.some(item => item.product.id === p.id)).slice(0, 2).map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -2 }}
                        className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2C2A29] text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-[#00825A] font-bold text-sm">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(product)}
                            className="p-2 bg-[#00825A] text-white rounded-lg hover:bg-[#00825A]/90 transition-colors"
                          >
                            <FiPlus size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen de la compra */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-[#2C2A29] mb-6">
                    Resumen de Compra
                  </h2>

                  {/* Desglose de costos según especificaciones exactas de tienda */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Tarifa base de procesamiento</span>
                      <span className="font-semibold">{formatPrice(baseFee)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Costo de envío</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600 font-bold">¡GRATIS!</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>

                    {subtotal <= 50000 && (
                      <div className="bg-blue-50 rounded-lg p-3 text-sm">
                        <p className="text-blue-700">
                          💡 Agrega {formatPrice(50000 - subtotal)} más para envío gratis
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#2C2A29]">Total</span>
                        <span className="text-2xl font-bold text-[#00825A]">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Beneficios */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiShield className="text-[#00825A]" size={16} />
                      <span>Pago seguro con encriptación SSL</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiTruck className="text-[#00825A]" size={16} />
                      <span>Entrega en 24-48 horas</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiCheck className="text-[#00825A]" size={16} />
                      <span>Garantía de satisfacción 30 días</span>
                    </div>
                  </div>

                  {/* Botón de pago para todo el carrito */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <FiCreditCard size={20} />
                    <span>Pagar Todo - {formatPrice(totalAmount)}</span>
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Al continuar, aceptas nuestros términos y condiciones
                  </p>
                </div>

                {/* Historial de transacciones recientes */}
                {completedTransactions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-[#2C2A29] mb-4">
                      Compras Recientes
                    </h3>
                    <div className="space-y-3">
                      {completedTransactions.slice(-3).map((transaction, index) => (
                        <div
                          key={transaction.id || index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#2C2A29]">
                              {transaction.reference}
                            </p>
                            <p className="text-gray-600">{transaction.createdAt}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            transaction.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Checkout Process integrado según flujo de 5 pasos */}
        <AnimatePresence>
          {showCheckoutModal && selectedProduct && (
            <CheckoutModal
              isOpen={showCheckoutModal}
              product={selectedProduct}
              quantity={selectedQuantity}
              onClose={() => {
                setShowCheckoutModal(false);
                setSelectedProduct(null);
              }}
              onSuccess={handleCheckoutSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
