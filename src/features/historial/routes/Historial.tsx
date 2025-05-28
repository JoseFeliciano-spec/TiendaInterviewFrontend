/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {axios} from "@/lib/axios";
import {
  FiCreditCard,
  FiCheck,
  FiX,
  FiClock,
  FiPackage,
  FiTruck,
  FiEye,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useAuthState } from "@/hooks/useAuthState";

// ✅ Interfaces minimalistas según test de Wompi del search result [1]
interface Transaction {
  id: string;
  reference: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR";
  productName: string;
  quantity: number;
  amount: number;
  customerEmail: string;
  wompiTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  deliveryStatus?: string;
  trackingCode?: string;
}

interface HistoryResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

// ✅ Hook personalizado con react-query según search results [3], [5]
const useTransactionHistory = (page: number = 1, enabled: boolean = true) => {
  return useQuery<HistoryResponse, any>({
    queryKey: ["transaction-history", page],
    queryFn: async (): Promise<HistoryResponse> => {
      const response: any = await axios.get("/api/v1/products/historial");
      return response;
    },
    enabled,
  });
};

// ✅ Componente principal todo-en-uno según especificaciones del test
export function TransactionHistoryPage(){
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const {isAuthenticated, user} = useAuthState();
  const navigate = useNavigate();

  // ✅ Verificar autenticación según search result [4]
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("❌ No authentication found, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // ✅ Fetch data con react-query según search results [3], [5]
  const {
    data: historyData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTransactionHistory(currentPage, !!isAuthenticated);

  // ✅ Funciones de utilidad según especificaciones del test
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      APPROVED: {
        icon: FiCheck,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Aprobada",
      },
      DECLINED: {
        icon: FiX,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Rechazada",
      },
      PENDING: {
        icon: FiClock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Pendiente",
      },
      ERROR: {
        icon: FiX,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Error",
      },
    };
    return configs[status] || configs["PENDING"];
  };

  const getDeliveryConfig = (status?: string) => {
    const configs: any = {
      ASSIGNED: { icon: FiPackage, color: "text-blue-600", label: "Asignado" },
      SHIPPED: { icon: FiTruck, color: "text-orange-600", label: "Enviado" },
      DELIVERED: { icon: FiCheck, color: "text-green-600", label: "Entregado" },
    };
    return (
      configs[status as any] || {
        icon: FiClock,
        color: "text-gray-600",
        label: "Pendiente",
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    navigate("/login", { replace: true });
  };

  // ✅ Filtrar transacciones según search result [5]
  const filteredTransactions = historyData?.data.transactions.filter(
    (transaction: Transaction) => {
      if (statusFilter === "ALL") return true;
      return transaction.status === statusFilter;
    }
  );

  // ✅ Loading state según search result [3]
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00825A] to-[#B0F2AE] flex items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ✅ Error state según search result [3]
  if (error && error.message !== "NO_AUTH") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md text-center shadow-2xl"
        >
          <FiX className="text-red-500 mx-auto mb-4" size={40} />
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Error al cargar historial
          </h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors w-full md:w-auto"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00825A] to-[#B0F2AE]">
      {/* ✅ Header móvil first */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                Mi Historial de Compras
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                Todas tus transacciones realizadas con Wompi
              </p>
            </div>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-xl transition-colors backdrop-blur-sm self-center md:self-auto"
              >
                <FiRefreshCw
                  className={isFetching ? "animate-spin" : ""}
                  size={18}
                />
              </button>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4 flex items-center justify-center md:justify-start space-x-2 md:space-x-3">
                <FiUser className="text-white" size={14} />
                <div className="text-center md:text-left">
                  <p className="text-white/80 text-xs">Bienvenido,</p>
                  <p className="text-white font-semibold text-sm">
                    {user?.name || user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white p-2 md:p-3 rounded-xl transition-colors self-center md:self-auto"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* ✅ Filtros móvil first */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 md:px-4 text-sm md:text-base focus:ring-2 focus:ring-[#00825A] focus:border-[#00825A] transition-colors"
              >
                <option value="ALL">Todas las transacciones</option>
                <option value="APPROVED">Aprobadas</option>
                <option value="PENDING">Pendientes</option>
                <option value="DECLINED">Rechazadas</option>
                <option value="ERROR">Con error</option>
              </select>
            </div>

            <div className="flex justify-center space-x-8 md:space-x-6 text-sm">
              <div className="text-center">
                <p className="text-gray-500">Total</p>
                <p className="text-xl md:text-2xl font-bold text-[#00825A]">
                  {historyData?.data.total || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Mostrando</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {filteredTransactions?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Lista de transacciones móvil first */}
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence>
            {filteredTransactions?.map(
              (transaction: Transaction, index: number) => {
                const statusConfig = getStatusConfig(transaction.status);
                const deliveryConfig = getDeliveryConfig(
                  transaction.deliveryStatus
                );

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiCreditCard className="text-white" size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">
                              {transaction.productName}
                            </h3>
                            <p className="text-gray-500 text-xs md:text-sm">
                              Ref: {transaction.reference}
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="text-center md:text-right">
                          <p className="text-xl md:text-2xl font-bold text-[#00825A] mb-1">
                            {formatPrice(transaction.amount)}
                          </p>
                          <p className="text-gray-500 text-xs md:text-sm">
                            Cantidad: {transaction.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex flex-wrap gap-2">
                          {/* Status de pago */}
                          <div
                            className={`flex items-center space-x-1 md:space-x-2 px-2 py-1 md:px-3 rounded-full ${statusConfig.bg}`}
                          >
                            <statusConfig.icon
                              className={statusConfig.color}
                              size={14}
                            />
                            <span
                              className={`text-xs md:text-sm font-semibold ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>

                          {/* Status de delivery */}
                          {transaction.deliveryStatus && (
                            <div className="flex items-center space-x-1 md:space-x-2 px-2 py-1 md:px-3 rounded-full bg-gray-100">
                              <deliveryConfig.icon
                                className={deliveryConfig.color}
                                size={14}
                              />
                              <span
                                className={`text-xs md:text-sm font-semibold ${deliveryConfig.color}`}
                              >
                                {deliveryConfig.label}
                              </span>
                            </div>
                          )}

                          {/* Tracking code */}
                          {transaction.trackingCode && (
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Tracking: {transaction.trackingCode}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setShowDetails(
                              showDetails === transaction.id
                                ? null
                                : transaction.id
                            )
                          }
                          className="text-[#00825A] hover:text-[#00825A]/80 p-2 rounded-lg hover:bg-[#00825A]/10 transition-colors self-center md:self-auto"
                        >
                          <FiEye size={18} />
                        </button>
                      </div>

                      {/* ✅ Detalles expandibles móvil first */}
                      <AnimatePresence>
                        {showDetails === transaction.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Email:</p>
                                <p className="font-semibold break-all">
                                  {transaction.customerEmail}
                                </p>
                              </div>

                              {transaction.wompiTransactionId && (
                                <div>
                                  <p className="text-gray-500 text-xs">ID Wompi:</p>
                                  <p className="font-mono text-xs break-all">
                                    {transaction.wompiTransactionId}
                                  </p>
                                </div>
                              )}

                              <div>
                                <p className="text-gray-500 text-xs">Creado:</p>
                                <p className="font-semibold text-xs">
                                  {formatDate(transaction.createdAt)}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 text-xs">Actualizado:</p>
                                <p className="font-semibold text-xs">
                                  {formatDate(transaction.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>

        {/* ✅ Estado vacío móvil first */}
        {filteredTransactions?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
          >
            <FiPackage className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {statusFilter === "ALL"
                ? "Aún no has realizado ninguna compra."
                : `No hay transacciones con estado "${statusFilter}".`}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-6 py-3 md:px-8 rounded-xl font-semibold hover:shadow-lg transition-all w-full md:w-auto"
            >
              Explorar Productos
            </button>
          </motion.div>
        )}

        {/* ✅ Paginación móvil first */}
        {historyData?.data.totalPages && historyData.data.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mt-6 md:mt-8">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
                Página {historyData.data.page} de {historyData.data.totalPages}
              </div>

              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!historyData.data.hasPrev}
                  className="flex items-center space-x-1 md:space-x-2 px-3 py-2 md:px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <FiChevronLeft size={14} />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <span className="px-3 py-2 md:px-4 text-sm font-medium">
                  {currentPage}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!historyData.data.hasNext}
                  className="flex items-center space-x-1 md:space-x-2 px-3 py-2 md:px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
