import { useForm, type UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquemas de validación según especificaciones del test
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email es requerido')
    .email('Email debe tener un formato válido')
    .max(100, 'Email no puede exceder 100 caracteres')
    .trim(),
  
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(6, 'Contraseña debe tener al menos 6 caracteres')
    .max(50, 'Contraseña no puede exceder 50 caracteres'),
});

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nombre es requerido')
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre no puede exceder 50 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nombre solo puede contener letras y espacios')
    .trim(),
  
  email: yup
    .string()
    .required('Email es requerido')
    .email('Email debe tener un formato válido')
    .max(100, 'Email no puede exceder 100 caracteres')
    .trim(),
  
  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .max(50, 'Contraseña no puede exceder 50 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  
  confirmPassword: yup
    .string()
    .required('Confirmar contraseña es requerido')
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir'),
});

// Tipos TypeScript derivados de los esquemas
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;

// Hook para formulario de login
export const useLoginForm = (): UseFormReturn<LoginFormData> => {
  return useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange', // Validación en tiempo real
    reValidateMode: 'onChange',
    criteriaMode: 'all', // Mostrar todos los errores
  });
};

// Hook para formulario de registro
export const useRegisterForm = (): UseFormReturn<RegisterFormData> => {
  return useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validación en tiempo real
    reValidateMode: 'onChange',
    criteriaMode: 'all', // Mostrar todos los errores
  });
};

// Hook adicional para validaciones específicas (opcional)
export const useAuthValidation = () => {
  // Validar fuerza de contraseña
  const validatePasswordStrength = (password: string) => {
    const strength = {
      score: 0,
      feedback: [] as string[],
    };

    if (password.length >= 8) strength.score++;
    else strength.feedback.push('Debe tener al menos 8 caracteres');

    if (/[a-z]/.test(password)) strength.score++;
    else strength.feedback.push('Debe contener al menos una letra minúscula');

    if (/[A-Z]/.test(password)) strength.score++;
    else strength.feedback.push('Debe contener al menos una letra mayúscula');

    if (/\d/.test(password)) strength.score++;
    else strength.feedback.push('Debe contener al menos un número');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength.score++;
    else strength.feedback.push('Debe contener al menos un carácter especial');

    return strength;
  };

  // Validar email en tiempo real
  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return {
    validatePasswordStrength,
    validateEmailFormat,
  };
};
