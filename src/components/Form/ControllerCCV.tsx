/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface ControlledCVVInputProps {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const ControlledCVVInput: React.FC<ControlledCVVInputProps> = ({
  name,
  control,
  label,
  placeholder = "123",
  required = false,
}) => {
  const [showCvv, setShowCvv] = useState(false);

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
            <input
              {...field}
              type={showCvv ? "text" : "password"}
              placeholder={placeholder}
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00825A] focus:border-transparent pr-10 text-sm transition-colors ${
                error
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                field.onChange(value);
              }}
              aria-invalid={!!error}
            />
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showCvv ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
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
