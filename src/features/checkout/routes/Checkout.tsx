/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiStar,
} from "react-icons/fi";
import { useCart } from "@/hooks/cart/useCart"; // Solo usar nuestro hook de Redux
import { CheckoutModal } from "../components/CheckoutModal";
import { useAuthState } from "@/hooks/useAuthState";
import { useAppDispatch } from "@/store/redux";
import { openLoginModal } from "@/store/slices/auth/authModalSlice";

// Solo tipos necesarios para transacciones, sin productos mock
interface Transaction {
  id: string;
  reference: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR";
  wompiTransactionId?: string;
  productId: string;
  quantity: number;
  createdAt: string;
}

export function CheckoutPage() {
  // 🔥 SOLO usar el hook useCart - eliminar todo useState del carrito
  const {
    items: cartItems,
    totalQuantity: totalItems,
    isEmpty,
    removeProduct,
    incrementItem,
    decrementItem,
    formatPrice,
  } = useCart();

  const { isAuthenticated } = useAuthState();

  const dispatch = useAppDispatch();
  // Solo estado para UI y modal, NO para productos ni carrito
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [completedTransactions, setCompletedTransactions] = useState<
    Transaction[]
  >([]);

  // 🔥 Cargar solo datos de transacciones - el carrito ya se maneja en Redux
  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);

      // Simular carga realística
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 🔥 NO cargar carrito - ya está en Redux automáticamente
      // Solo cargar transacciones completadas para historial
      const savedTransactions = localStorage.getItem("tienda_transactions");
      if (savedTransactions) {
        try {
          setCompletedTransactions(JSON.parse(savedTransactions));
        } catch (error) {
          console.error("Error parsing transactions:", error);
        }
      }

      setLoading(false);
    };

    loadCheckoutData();
  }, []);

  // Funciones simplificadas - usar directamente el hook
  const handleProductCheckout = (item: any) => {
    if(!isAuthenticated){
      dispatch(openLoginModal());
      return;
    }
    setSelectedProduct(item);
    setShowCheckoutModal(true);
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
                    {totalItems} {totalItems === 1 ? "producto" : "productos"}{" "}
                    en tu carrito
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
          {/* 🔥 Usar isEmpty del hook en lugar de cartItems.length */}
          {isEmpty ? (
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
                onClick={() => (window.location.href = "/productos")}
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
                    {/* 🔥 Usar cartItems del hook directamente */}
                    {cartItems.map((item: any) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all"
                      >
                        {/* Imagen del producto */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                          />
                          {item.originalPrice && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              OFERTA
                            </div>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#2C2A29] text-sm sm:text-base line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-1 mb-2">
                            {item.description}
                          </p>

                          {/* Rating y categoria */}
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <FiStar
                                size={12}
                                className="text-yellow-400 fill-current"
                              />
                              <span className="text-gray-600">
                                {item?.rating || 4.5}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {item.category || "Productos"}
                            </span>
                          </div>

                          {/* Precios */}
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="font-bold text-[#00825A] text-sm sm:text-base">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-gray-400 line-through text-xs">
                                {formatPrice(item.originalPrice)}
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
                              onClick={() => decrementItem(item.id)}
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
                              onClick={() => incrementItem(item.id)}
                              disabled={item.quantity >= item.stock}
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
                              onClick={() => removeProduct(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Eliminar del carrito"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </div>
                        </div>

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
              </div>

              {/* Resumen de la compra */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
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
                </div>

                {/* Historial de transacciones recientes */}
                {completedTransactions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-[#2C2A29] mb-4">
                      Compras Recientes
                    </h3>
                    <div className="space-y-3">
                      {completedTransactions
                        .slice(-3)
                        .map((transaction, index) => (
                          <div
                            key={transaction.id || index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <div>
                              <p className="font-semibold text-[#2C2A29]">
                                {transaction.reference}
                              </p>
                              <p className="text-gray-600">
                                {transaction.createdAt}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                transaction.status === "APPROVED"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
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
              onClose={() => {
                setShowCheckoutModal(false);
                setSelectedProduct(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
