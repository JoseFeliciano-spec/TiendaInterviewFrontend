/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
      <div className="min-h-screen bg-gradient-to-br from-[#00825A] to-[#B0F2AE] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
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
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <FiX className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Error al cargar historial
          </h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00825A] to-[#B0F2AE]">
      {/* ✅ Header según especificaciones del test */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Mi Historial de Compras
              </h1>
              <p className="text-white/80">
                Todas tus transacciones realizadas con Wompi
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-colors backdrop-blur-sm"
              >
                <FiRefreshCw
                  className={isFetching ? "animate-spin" : ""}
                  size={20}
                />
              </button>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center space-x-3">
                <FiUser className="text-white" size={16} />
                <div>
                  <p className="text-white/80 text-sm">Bienvenido,</p>
                  <p className="text-white font-semibold">
                    {user?.name || user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-xl transition-colors"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Filtros según search result [5] */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00825A] focus:border-[#00825A] transition-colors"
              >
                <option value="ALL">Todas las transacciones</option>
                <option value="APPROVED">Aprobadas</option>
                <option value="PENDING">Pendientes</option>
                <option value="DECLINED">Rechazadas</option>
                <option value="ERROR">Con error</option>
              </select>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="text-gray-500">Total</p>
                <p className="text-2xl font-bold text-[#00825A]">
                  {historyData?.data.total || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Mostrando</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTransactions?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Lista de transacciones según especificaciones del test */}
        <div className="space-y-4">
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
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center">
                            <FiCreditCard className="text-white" size={20} />
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {transaction.productName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Ref: {transaction.reference}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#00825A] mb-1">
                            {formatPrice(transaction.amount)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Cantidad: {transaction.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Status de pago */}
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig.bg}`}
                          >
                            <statusConfig.icon
                              className={statusConfig.color}
                              size={16}
                            />
                            <span
                              className={`text-sm font-semibold ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>

                          {/* Status de delivery */}
                          {transaction.deliveryStatus && (
                            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
                              <deliveryConfig.icon
                                className={deliveryConfig.color}
                                size={16}
                              />
                              <span
                                className={`text-sm font-semibold ${deliveryConfig.color}`}
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
                          className="text-[#00825A] hover:text-[#00825A]/80 p-2 rounded-lg hover:bg-[#00825A]/10 transition-colors"
                        >
                          <FiEye size={20} />
                        </button>
                      </div>

                      {/* ✅ Detalles expandibles */}
                      <AnimatePresence>
                        {showDetails === transaction.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Email:</p>
                                <p className="font-semibold">
                                  {transaction.customerEmail}
                                </p>
                              </div>

                              {transaction.wompiTransactionId && (
                                <div>
                                  <p className="text-gray-500">ID Wompi:</p>
                                  <p className="font-mono text-xs">
                                    {transaction.wompiTransactionId}
                                  </p>
                                </div>
                              )}

                              <div>
                                <p className="text-gray-500">Creado:</p>
                                <p className="font-semibold">
                                  {formatDate(transaction.createdAt)}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500">Actualizado:</p>
                                <p className="font-semibold">
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

        {/* ✅ Estado vacío */}
        {filteredTransactions?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <FiPackage className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === "ALL"
                ? "Aún no has realizado ninguna compra."
                : `No hay transacciones con estado "${statusFilter}".`}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Explorar Productos
            </button>
          </motion.div>
        )}

        {/* ✅ Paginación según search result [3] */}
        {historyData?.data.totalPages && historyData.data.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {historyData.data.page} de {historyData.data.totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!historyData.data.hasPrev}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                  <span>Anterior</span>
                </button>

                <span className="px-4 py-2 text-sm font-medium">
                  {currentPage}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!historyData.data.hasNext}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Siguiente</span>
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};