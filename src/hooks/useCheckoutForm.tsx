/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCheckoutForm.ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación según especificaciones del test
const checkoutSchema = yup.object().shape({
  // Datos de tarjeta
  cardNumber: yup
    .string()
    .required('Número de tarjeta es requerido')
    .test('card-validation', 'Número de tarjeta inválido', (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length < 13 || cleaned.length > 19) return false;
      
      // Algoritmo de Luhn
      let sum = 0;
      let isEven = false;
      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }),
  
  expiryDate: yup
    .string()
    .required('Fecha de expiración es requerida')
    .matches(/^\d{2}\/\d{2}$/, 'Formato debe ser MM/YY'),
  
  cvv: yup
    .string()
    .required('CVV es requerido')
    .matches(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos'),
  
  cardholderName: yup
    .string()
    .required('Nombre del titular es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres'),
  
  documentType: yup
    .string()
    .required('Tipo de documento es requerido')
    .oneOf(['CC', 'CE', 'NIT', 'PP']),
  
  documentNumber: yup
    .string()
    .required('Número de documento es requerido')
    .min(6, 'Mínimo 6 dígitos'),
  
  // Datos de entrega
  firstName: yup
    .string()
    .required('Nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  
  lastName: yup
    .string()
    .required('Apellido es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  
  email: yup
    .string()
    .required('Email es requerido')
    .email('Email inválido'),
  
  phone: yup
    .string()
    .required('Teléfono es requerido')
    .min(10, 'Mínimo 10 dígitos'),
  
  address: yup
    .string()
    .required('Dirección es requerida')
    .min(10, 'Mínimo 10 caracteres'),
  
  city: yup
    .string()
    .required('Ciudad es requerida')
    .min(2, 'Mínimo 2 caracteres')
});

export interface CheckoutFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export const useCheckoutForm = (): any => {
  const form = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      documentType: 'CC',
      documentNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: ''
    },
    mode: 'onChange'
  });

  return form;
};
