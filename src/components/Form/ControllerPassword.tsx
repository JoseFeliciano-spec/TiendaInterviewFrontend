/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { type Control, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

interface ControlledPasswordInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showStrengthIndicator?: boolean;
}

export const ControlledPasswordInput: React.FC<ControlledPasswordInputProps> = ({
  name,
  control,
  label,
  placeholder = 'Ingresa tu contraseña',
  required = false,
  className = '',
  showStrengthIndicator = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Función para evaluar la fortaleza de la contraseña
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthLevels = {
      0: { label: '', color: '', bgColor: '' },
      1: { label: 'Muy débil', color: 'text-red-600', bgColor: 'bg-red-500' },
      2: { label: 'Débil', color: 'text-orange-600', bgColor: 'bg-orange-500' },
      3: { label: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
      4: { label: 'Fuerte', color: 'text-blue-600', bgColor: 'bg-blue-500' },
      5: { label: 'Muy fuerte', color: 'text-green-600', bgColor: 'bg-green-500' }
    };

    return { score, ...strengthLevels[score as keyof typeof strengthLevels] };
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const strength = showStrengthIndicator ? getPasswordStrength(field.value) : null;
        
        return (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...field}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00825A] focus:border-transparent text-sm transition-colors ${
                  error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                } ${className}`}
                aria-invalid={!!error}
                aria-describedby={`${name}-error ${showStrengthIndicator ? `${name}-strength` : ''}`}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <AnimatePresence mode="wait">
                  {showPassword ? (
                    <motion.div
                      key="hide"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiEyeOff size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="show"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiEye size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            {showStrengthIndicator && field.value && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
                id={`${name}-strength`}
              >
                {/* Barra de progreso */}
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: level <= (strength?.score || 0) ? 1 : 0,
                        backgroundColor: level <= (strength?.score || 0) 
                          ? (strength?.score === 1 ? '#EF4444' :
                             strength?.score === 2 ? '#F97316' :
                             strength?.score === 3 ? '#EAB308' :
                             strength?.score === 4 ? '#3B82F6' : '#10B981')
                          : '#E5E7EB'
                      }}
                      transition={{ duration: 0.3, delay: level * 0.1 }}
                      className="h-2 flex-1 rounded-full origin-left"
                      style={{ 
                        backgroundColor: level <= (strength?.score || 0) 
                          ? (strength?.score === 1 ? '#EF4444' :
                             strength?.score === 2 ? '#F97316' :
                             strength?.score === 3 ? '#EAB308' :
                             strength?.score === 4 ? '#3B82F6' : '#10B981')
                          : '#E5E7EB'
                      }}
                    />
                  ))}
                </div>
                
                {/* Etiqueta de fortaleza */}
                {strength?.label && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs font-medium ${strength.color}`}
                  >
                    Fortaleza: {strength.label}
                  </motion.p>
                )}
                
                {/* Criterios de contraseña (solo para registro) */}
                {name === 'password' && showStrengthIndicator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs space-y-1"
                  >
                    <p className="text-gray-600 font-medium">Debe contener:</p>
                    <div className="grid grid-cols-1 gap-1">
                      <div className={`flex items-center space-x-2 ${
                        field.value.length >= 8 ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">
                          {field.value.length >= 8 ? '✓' : '○'}
                        </span>
                        <span>Al menos 8 caracteres</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /[a-z]/.test(field.value) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">
                          {/[a-z]/.test(field.value) ? '✓' : '○'}
                        </span>
                        <span>Una letra minúscula</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /[A-Z]/.test(field.value) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">
                          {/[A-Z]/.test(field.value) ? '✓' : '○'}
                        </span>
                        <span>Una letra mayúscula</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        /\d/.test(field.value) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">
                          {/\d/.test(field.value) ? '✓' : '○'}
                        </span>
                        <span>Un número</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  id={`${name}-error`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                >
                  <span>⚠️</span>
                  <span>{error.message}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    />
  );
};
