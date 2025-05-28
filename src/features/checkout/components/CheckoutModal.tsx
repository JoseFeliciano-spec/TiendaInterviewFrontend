/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/checkout/CheckoutModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormProvider } from "react-hook-form";
import {
  FiCreditCard,
  FiCheck,
  FiShield,
  FiArrowLeft,
  FiLock,
  FiX,
  FiLoader,
} from "react-icons/fi";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useCart } from "@/hooks/cart/useCart";
import {
  useCreateTransaction,
  useTransactionStatus,
} from "@/hooks/useTransactionMutation";
import { StepPayment } from "./StepPayment";
import { axios } from "@/lib/axios";

// ✅ Types según especificaciones del test de tienda del search result [1]
interface Transaction {
  transactionId: string;
  reference: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR";
  productName: string;
  quantity: number;
  customerEmail: string;
  createdAt: string;
}

type CheckoutStep = "payment" | "summary" | "processing" | "result";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  // ✅ Estados según flujo de 5 pasos del search result [1]
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<any>(null);

  // ✅ Hooks según especificaciones del test
  const { items: cartItems, isEmpty, removeProduct, formatPrice } = useCart();
  const methods = useCheckoutForm();
  const { handleSubmit } = methods;

  // ✅ API hooks para integración con backend según search result [2]
  const createTransactionMutation = useCreateTransaction();
  const { data: statusData, isLoading: isCheckingStatus } =
    useTransactionStatus(
      transaction?.transactionId || null,
      !!transaction?.transactionId && transaction?.status === "PENDING"
    );

  // ✅ Auto-seleccionar primer producto del carrito
  const selectedCartItem = cartItems[0];
  const quantity = selectedCartItem?.quantity || 1;

  // ✅ Reset modal cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("payment");
      setTransaction(null);
      setFormData(null);
      createTransactionMutation.reset();
    }
  }, [isOpen, createTransactionMutation]);

  // ✅ Auto-detectar cambios de status del webhook según search result [1]
  useEffect(() => {
    if (statusData?.data && !statusData.data.isPending) {
      setCurrentStep("result");
      setTransaction((prev) =>
        prev
          ? {
              ...prev,
              status: statusData.data.status,
            }
          : null
      );
    }
  }, [statusData?.data]);

  // ✅ Cálculos según especificaciones exactas del test de tienda del search result [1]
  const productAmount = selectedCartItem
    ? selectedCartItem.price * quantity
    : 0;
  const baseFee = 5000; // Fee base según documento PDF
  const deliveryFee = productAmount > 50000 ? 0 : 8000; // Envío gratis > $50k según test
  const totalAmount = productAmount + baseFee + deliveryFee;

  // ✅ Opciones de documento según especificaciones del test
  const documentOptions = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "NIT", label: "NIT" },
    { value: "PP", label: "Pasaporte" },
  ];

  // ✅ Manejar envío del formulario según flujo de 5 pasos
  const onSubmit = async (data: any) => {
    if (currentStep === "payment") {
      setFormData(data);
      setCurrentStep("summary");
    } else if (currentStep === "summary") {
      await processTransaction();
    }
  };

  // ✅ Proceso de transacción con backend según search result [2]
  const processTransaction = async () => {
    if (!selectedCartItem || !formData) return;

    try {
      setCurrentStep("processing");

      // ✅ Step 2 del flujo: "Credit Card/Delivery info" → Crear transacción PENDING
      console.log(
        "🚀 Creating transaction according to tienda 5-step process..."
      );

      const transactionData = {
        productId: selectedCartItem.id,
        quantity,
        cardNumber: formData?.cardNumber?.replace(/\s+/g, ""),
        cardHolder: formData?.cardholderName,
        cvv: formData?.cvv,
        expiryDate: formData?.expiryDate,
        customerEmail: formData.email,
        customerName: formData.firstName + " " + formData.lastName,
        customerPhone: formData.phone,
        customerDocument: formData.documentNumber,
        customerDocumentType: formData.documentType,
        deliveryInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          department: "Cundinamarca", // Default según test
          postalCode: "110111", // Default según test
          country: "CO",
          specialInstructions: "Checkout integrado según test de tienda",
        },
      };

      const result: any = await createTransactionMutation.mutateAsync(
        transactionData
      );

      if (result?.data?.status === "PENDING") {
        const newTransaction: Transaction = {
          transactionId: result.data.transactionId,
          reference: result.data.reference,
          amount: result.data.amount,
          status: "PENDING",
          productName: result.data.productName,
          quantity: result.data.quantity,
          customerEmail: formData.email,
          createdAt: new Date().toISOString(),
        };

        const pending: any = await axios.get(result?.data?.statusUrl);

        if (!pending?.success) {
          return;
        }
        setTransaction(newTransaction);
        setCurrentStep("result");
        handleSuccessfulTransaction(newTransaction);
      } else {
        throw new Error(result?.error || "Failed to create transaction");
      }
    } catch (error: any) {
      console.error("❌ Error processing transaction:", error);

      const errorTransaction: Transaction = {
        transactionId: `error_${Date.now()}`,
        reference: `ERROR_${Date.now()}`,
        amount: totalAmount,
        status: "ERROR",
        productName: selectedCartItem.name,
        quantity,
        customerEmail: formData.email,
        createdAt: new Date().toISOString(),
      };

      setTransaction(errorTransaction);
      setCurrentStep("result");
    }
  };

  // ✅ Step 5 del flujo: "Product page" → Acciones post-pago según search result [1]
  const handleSuccessfulTransaction = async (
    successTransaction: Transaction
  ) => {
    if (!selectedCartItem) return;

    try {
      console.log("✅ Transaction APPROVED - Executing Step 5 actions");

      // 1. Guardar en localStorage para historial
      const existingTransactions = localStorage.getItem("tienda_transactions");
      const transactions = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];
      transactions.push({
        ...successTransaction,
        completedAt: new Date().toISOString(),
      });
      localStorage.setItem("tienda_transactions", JSON.stringify(transactions));

      // 2. Remover del carrito (compra completada)
      removeProduct(selectedCartItem.id);

      // 3. Auto-cerrar modal después de mostrar éxito
      setTimeout(() => {
        onClose();
      }, 4000);

      console.log("✅ Step 5 completed successfully");
    } catch (error) {
      console.error("❌ Error in Step 5 execution:", error);
    }
  };

  // ✅ Indicador de progreso según flujo de 5 pasos del search result [1]
  const ProgressIndicator = () => {
    const steps = [
      { id: "payment", label: "Pago", icon: FiCreditCard },
      { id: "summary", label: "Resumen", icon: FiCheck },
      { id: "processing", label: "Procesando", icon: FiLoader },
      { id: "result", label: "Resultado", icon: FiShield },
    ];

    const getStepIndex = () => {
      switch (currentStep) {
        case "payment":
          return 0;
        case "summary":
          return 1;
        case "processing":
          return 2;
        case "result":
          return 3;
        default:
          return 0;
      }
    };

    const currentIndex = getStepIndex();

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              animate={{
                backgroundColor: index <= currentIndex ? "#00825A" : "#E5E7EB",
                color: index <= currentIndex ? "#FFFFFF" : "#9CA3AF",
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
            >
              <step.icon size={18} />
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: index < currentIndex ? "#00825A" : "#E5E7EB",
                }}
                className="w-12 h-1 mx-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // ✅ Renderizado del contenido por paso según especificaciones del test
  const renderStepContent = () => {
    switch (currentStep) {
      case "payment":
        return (
          <FormProvider {...methods}>
            <StepPayment
              onSubmit={onSubmit}
              onClose={onClose}
              documentOptions={documentOptions}
              isLoading={createTransactionMutation.isPending}
            />
          </FormProvider>
        );

      case "summary":
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mb-2">
                Confirmar Compra
              </h2>
              <p className="text-gray-600 text-sm">
                Resumen final según especificaciones del test de tienda
              </p>
            </div>

            {/* ✅ Producto seleccionado */}
            {selectedCartItem && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <img
                  src={selectedCartItem.image}
                  alt={selectedCartItem.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">
                    {selectedCartItem.name}
                  </h4>
                  <p className="text-sm text-gray-600">Cantidad: {quantity}</p>
                  <p className="font-bold text-[#00825A]">
                    {formatPrice(selectedCartItem.price * quantity)}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ Totales según especificaciones exactas del test */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  {formatPrice(productAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee base:</span>
                <span className="font-semibold">{formatPrice(baseFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">GRATIS</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t">
                <span>Total:</span>
                <span className="text-[#00825A]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* ✅ Información del cliente */}
            {formData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Datos del Cliente
                </h4>
                <p className="text-blue-800 text-sm">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-blue-600 text-sm">{formData.email}</p>
                <p className="text-blue-600 text-sm">
                  {formData.address}, {formData.city}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep("payment")}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FiArrowLeft size={16} />
                <span>Modificar</span>
              </motion.button>

              <motion.button
                onClick={handleSubmit(onSubmit)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={createTransactionMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                <FiLock size={16} />
                <span>
                  {createTransactionMutation.isPending
                    ? "Procesando..."
                    : `Pagar ${formatPrice(totalAmount)}`}
                </span>
              </motion.button>
            </div>
          </motion.div>
        );

      case "processing":
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#00825A] rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-3 border-white border-t-transparent rounded-full"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Procesando con tienda
            </h3>
            <p className="text-gray-600 mb-2">
              Creando transacción en el backend...
            </p>
            <p className="text-gray-500 text-sm">
              Esperando confirmación del webhook...
            </p>

            {transaction && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800 font-medium">Transacción creada</p>
                <p className="text-blue-600 text-sm">
                  ID: {transaction.transactionId}
                </p>
                <p className="text-blue-600 text-sm">
                  Referencia: {transaction.reference}
                </p>
                <p className="text-blue-600 text-sm">
                  Estado: {transaction.status}
                </p>
              </div>
            )}
          </div>
        );

      case "result":
        return (
          <div className="text-center py-8">
            {transaction?.status === "APPROVED" ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheck className="text-white" size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  ¡Pago Exitoso!
                </h3>
                <p className="text-gray-600 mb-4">
                  Tu pedido ha sido procesado según especificaciones de tienda
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-green-900 mb-3">
                    Detalles de la Transacción
                  </h4>
                  <div className="space-y-2 text-left">
                    <p className="text-green-800">
                      <strong>Referencia:</strong> {transaction.reference}
                    </p>
                    <p className="text-green-700">
                      <strong>Producto:</strong> {transaction.productName}
                    </p>
                    <p className="text-green-700">
                      <strong>Total:</strong> {formatPrice(transaction.amount)}
                    </p>
                    <p className="text-green-700">
                      <strong>Email:</strong> {transaction.customerEmail}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-green-600 text-sm">
                      ✅ Stock actualizado automáticamente
                    </p>
                    <p className="text-green-600 text-sm">
                      📦 Producto asignado para delivery
                    </p>
                    <p className="text-green-600 text-sm">
                      📧 Email de confirmación enviado
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Se cerrará automáticamente en unos segundos...
                </p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiX className="text-white" size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Error en el Pago
                </h3>
                <p className="text-gray-600 mb-4">
                  Hubo un problema procesando tu transacción con tienda
                </p>

                {transaction && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-800 font-medium">
                      Estado: {transaction.status}
                    </p>
                    <p className="text-red-600 text-sm">
                      Referencia: {transaction.reference}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setCurrentStep("summary")}
                  className="text-[#00825A] font-medium hover:underline mb-4"
                >
                  Intentar nuevamente
                </button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {transaction?.status === "APPROVED"
                ? "Continuar Comprando"
                : "Cerrar"}
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  // ✅ No renderizar si no está abierto o carrito vacío
  if (!isOpen || isEmpty) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={(e) =>
          e.target === e.currentTarget &&
          currentStep !== "processing" &&
          onClose()
        }
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            {/* ✅ Header con progreso */}
            <div className="mb-8">
              <ProgressIndicator />
            </div>

            {/* ✅ Contenido animado */}
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            {/* ✅ Debug info (solo en desarrollo) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono">
                <p>
                  <strong>Debug:</strong>
                </p>
                <p>Step: {currentStep}</p>
                <p>Product: {selectedCartItem?.id || "None"}</p>
                <p>Transaction: {transaction?.transactionId || "None"}</p>
                <p>
                  Status Polling: {isCheckingStatus ? "Active" : "Inactive"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
