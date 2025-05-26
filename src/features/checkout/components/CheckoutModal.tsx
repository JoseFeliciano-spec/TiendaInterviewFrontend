/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CheckoutModal.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCreditCard,
  FiCheck,
  FiShield,
  FiArrowLeft,
  FiLock,
} from "react-icons/fi";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

import { StepPayment } from "./StepPayment";
import { FormProvider } from "react-hook-form";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR";
  tiendaTransactionId?: string;
  productId: number;
  quantity: number;
  createdAt: string;
}

type CheckoutStep = "payment" | "summary" | "processing" | "result";

interface CheckoutModalProps {
  isOpen: boolean;
  product: Product;
  quantity: number;
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
}

export function CheckoutModal({
  isOpen,
  product,
  quantity,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  // React Hook Form
  const methods = useCheckoutForm();

  const { handleSubmit } = methods;

  // Cálculos según especificaciones exactas del test
  const productAmount = product.price * quantity;
  const baseFee = 5000;
  const deliveryFee = productAmount > 50000 ? 0 : 8000;
  const totalAmount = productAmount + baseFee + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Opciones para el select de documento
  const documentOptions = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "NIT", label: "NIT" },
    { value: "PP", label: "Pasaporte" },
  ];

  // Manejar envío del formulario
  const onSubmit = async (data: any) => {
    if (currentStep === "payment") {
      setCurrentStep("summary");
    } else if (currentStep === "summary") {
      await processtiendaPayment(data);
    }
  };

  // Proceso de pago con la tienda
  const processtiendaPayment = async (data: any) => {
    try {
      setLoading(true);
      setCurrentStep("processing");

      const reference = `TXN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        reference,
        amount: totalAmount,
        status: "PENDING",
        productId: product.id,
        quantity,
        createdAt: new Date().toISOString(),
      };

      setTransaction(newTransaction);

      // Simular llamada a Tienda API (según especificaciones del documento)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        const updatedTransaction: Transaction = {
          ...newTransaction,
          status: "APPROVED",
          tiendaTransactionId: `tienda_${Date.now()}`,
        };
        setTransaction(updatedTransaction);
        setCurrentStep("result");
        onSuccess(updatedTransaction);
      } else {
        const failedTransaction: Transaction = {
          ...newTransaction,
          status: "DECLINED",
        };
        setTransaction(failedTransaction);
        setCurrentStep("result");
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
    } finally {
      setLoading(false);
    }
  };

  // Indicador de progreso
  const ProgressIndicator = () => {
    const steps = [
      { id: "payment", label: "Datos", icon: FiCreditCard },
      { id: "summary", label: "Resumen", icon: FiCheck },
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
          return 2;
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
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
            >
              <step.icon size={16} />
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: index < currentIndex ? "#00825A" : "#E5E7EB",
                }}
                className="w-8 h-1 mx-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Renderizado del contenido por paso
  const renderStepContent = () => {
    switch (currentStep) {
      case "payment":
        return (
          <FormProvider {...methods}>
            <StepPayment
              onSubmit={onSubmit}
              onClose={onClose}
              documentOptions={documentOptions}
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
            {/* Resumen del formulario */}
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mb-2">
                Confirmar Compra
              </h2>
              <p className="text-gray-600 text-sm">
                Revisa los datos antes de confirmar el pago
              </p>
            </div>

            {/* Resto del contenido de summary... */}
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
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                <FiLock size={16} />
                <span>Pagar {formatPrice(totalAmount)}</span>
              </motion.button>
            </div>
          </motion.div>
        );

      // ... (casos processing y result mantienen la misma lógica)
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) =>
          e.target === e.currentTarget &&
          currentStep !== "processing" &&
          onClose()
        }
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <ProgressIndicator />
            </div>
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
