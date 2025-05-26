/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface ControlledSelectProps {
  name: string;
  control: any;
  label: string;
  options: Option[];
  required?: boolean;
  className?: string;
}

export const ControlledSelect: React.FC<ControlledSelectProps> = ({
  name,
  control,
  label,
  options,
  required = false,
  className = ''
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
          <select
            {...field}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00825A] focus:border-transparent text-sm transition-colors ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            } ${className}`}
            aria-invalid={!!error}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-xs mt-1"
              >
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    />
  );
};
