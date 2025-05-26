/* eslint-disable @typescript-eslint/no-explicit-any */
// components/form/ControlledInput.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlledInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: any;
  maxLength?: number;
  className?: string;
  formatValue?: (value: string) => string;
  required?: boolean;
}

export const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  maxLength,
  className = '',
  formatValue,
  required = false
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
            )}
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              maxLength={maxLength}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00825A] focus:border-transparent text-sm transition-colors ${
                Icon ? 'pl-10' : ''
              } ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              } ${className}`}
              onChange={(e) => {
                const value = formatValue ? formatValue(e.target.value) : e.target.value;
                field.onChange(value);
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          </div>
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
      )}
    />
  );
};
