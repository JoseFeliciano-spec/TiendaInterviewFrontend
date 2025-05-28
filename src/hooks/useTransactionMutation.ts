/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useTransactionMutations.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import {axios} from '@/lib/axios';

// ✅ Interfaces según especificaciones exactas del search result [1]
interface CreateTransactionRequest {
  productId: string;
  quantity: number;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  customerDocument?: string;
  customerDocumentType?: 'CC' | 'CE' | 'NIT' | 'PP';
  deliveryInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    department: string;
    postalCode?: string;
    country?: string;
    specialInstructions?: string;
  };
}

interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    reference: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    amount: number;
    productName: string;
    quantity: number;
    statusUrl: string;
    estimatedWebhookTime: string;
    webhookEnabled: boolean;
  };
  statusCode: number;
}

interface TransactionStatusResponse {
  success: boolean;
  data: {
    transactionId: string;
    reference: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    amount: number;
    productName: string;
    quantity: number;
    customerEmail: string;
    isPending: boolean;
    isCompleted: boolean;
    canRetry: boolean;
    nextPollIn: number | null;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  statusCode: number;
}

// ✅ Axios instance según especificaciones del test de tienda del search result [1]
const api = axios;

// ✅ Hook para crear transacción según search result [2] TransactionUseCases
export const useCreateTransaction = () => {
  return useMutation<TransactionResponse, Error, CreateTransactionRequest>({
    mutationFn: async (transactionData: CreateTransactionRequest) : Promise<any> => {
      console.log('🚀 Creating transaction with tienda integration:', transactionData);
      
      // ✅ Llamada a endpoint real según especificaciones del test
      const response = await api.post<TransactionResponse>('/v1/transactions', transactionData);
      
      console.log('✅ Transaction created successfully:', response.data);
      return response;
    },
    onSuccess: (data) => {
      console.log('✅ Transaction created - ID:', data.data.transactionId);
      console.log('📋 Reference:', data.data.reference);
      console.log('⏱️ Estimated webhook time:', data.data.estimatedWebhookTime);
      
      // ✅ Guardar en localStorage para resilience según search result [1]
      const transactionProgress = {
        step: 3, // Summary step
        transactionId: data.data.transactionId,
        reference: data.data.reference,
        timestamp: Date.now(),
      };
      localStorage.setItem('tienda_checkout_progress', JSON.stringify(transactionProgress));
    },
    onError: (error: any) => {
      console.error('❌ Error creating transaction:', error.response?.data || error.message);
      
      // ✅ Limpiar progreso en caso de error
      localStorage.removeItem('tienda_checkout_progress');
    },
  });
};

// ✅ Hook para polling de status según flujo de 5 pasos del search result [1]
export const useTransactionStatus = (transactionId: string | null, enabled = true) => {
  return useQuery<TransactionStatusResponse, Error>({
    queryKey: ['transaction-status', transactionId],
    queryFn: async (): Promise<TransactionStatusResponse> => {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }
      
      console.log('🔍 Checking transaction status:', transactionId);
      
      // ✅ Llamada a endpoint real según especificaciones del test
      const response = await api.get<TransactionStatusResponse>(`/v1/transactions/${transactionId}/status`);
      
      console.log('📊 Status check result:', response.data.data.status);
      
      // ✅ Actualizar progreso para resilience según search result [1]
      if (response.data.data.status !== 'PENDING') {
        const finalProgress = {
          step: 5, // Final step
          transactionId: response.data.data.transactionId,
          reference: response.data.data.reference,
          status: response.data.data.status,
          timestamp: Date.now(),
        };
        localStorage.setItem('tienda_checkout_progress', JSON.stringify(finalProgress));
      }
      
      return response.data;
    },
    enabled: enabled && !!transactionId,
    refetchIntervalInBackground: true,
    staleTime: 0, // Siempre refetch para status updates
    retry: 3,
    retryDelay: 2000,
  });
};

// ✅ Hook para recuperar progreso según resilience requirement del search result [1]
export const useCheckoutProgress = () => {
  const getProgress = () => {
    try {
      const saved = localStorage.getItem('tienda_checkout_progress');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error reading checkout progress:', error);
      return null;
    }
  };

  const clearProgress = () => {
    localStorage.removeItem('tienda_checkout_progress');
  };

  const hasProgress = () => {
    const progress = getProgress();
    if (!progress) return false;
    
    // ✅ Progreso válido por 30 minutos según especificaciones del test
    const isValid = Date.now() - progress.timestamp < 30 * 60 * 1000;
    
    if (!isValid) {
      clearProgress();
      return false;
    }
    
    return true;
  };

  return {
    getProgress,
    clearProgress,
    hasProgress,
  };
};

// ✅ Hook combinado para flujo completo según search result [1] - 5 pasos
export const usetiendaCheckoutFlow = () => {
  const createTransactionMutation = useCreateTransaction();
  const { clearProgress } = useCheckoutProgress();
  
  const startCheckout = async (transactionData: CreateTransactionRequest) => {
    try {
      console.log('🎯 Starting tienda checkout flow - Step 2 of 5');
      
      // ✅ Step 2: "Credit Card/Delivery info" → Create PENDING transaction
      const result = await createTransactionMutation.mutateAsync(transactionData);
      
      console.log('✅ Step 2 completed - Transaction created:', result.data.reference);
      
      return {
        success: true,
        transactionId: result.data.transactionId,
        reference: result.data.reference,
        statusUrl: result.data.statusUrl,
        estimatedWebhookTime: result.data.estimatedWebhookTime,
      };
    } catch (error: any) {
      console.error('❌ Checkout flow failed:', error);
      clearProgress(); // Limpiar progreso en caso de error
      
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const resetFlow = () => {
    createTransactionMutation.reset();
    clearProgress();
  };

  return {
    startCheckout,
    resetFlow,
    isLoading: createTransactionMutation.isPending,
    error: createTransactionMutation.error,
    isSuccess: createTransactionMutation.isSuccess,
  };
};
