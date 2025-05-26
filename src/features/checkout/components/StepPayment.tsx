import {
  ControlledCVVInput,
  ControlledInput,
  ControlledSelect,
} from "@/components/Form";
import {
  formatCardNumber,
  formatExpiryDate,
  formatPhone,
  getCardType,
} from "@/utils/formatters";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import {
  FiArrowRight,
  FiCreditCard,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StepPayment({ onSubmit, onClose, documentOptions }: any) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useFormContext();

  // Watch para la tarjeta visual
  const cardNumber = watch("cardNumber");
  const cardholderName = watch("cardholderName");
  const expiryDate = watch("expiryDate");
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2C2A29] mb-2">
          Información de Pago
        </h2>
        <p className="text-gray-600 text-sm">
          Completa los datos de tu tarjeta y entrega
        </p>
      </div>

      {/* Tarjeta visual */}
      <div className="relative mb-6">
        <div className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl p-4 text-white shadow-xl max-w-sm mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs opacity-80">
              {getCardType(cardNumber) || "TARJETA"}
            </div>
            <div className="w-6 h-6 bg-white/20 rounded"></div>
          </div>

          <div className="font-mono text-sm tracking-wider mb-3">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="flex justify-between text-xs">
            <div>
              <div className="opacity-80">TITULAR</div>
              <div className="uppercase text-xs">
                {cardholderName || "NOMBRE APELLIDO"}
              </div>
            </div>
            <div>
              <div className="opacity-80">VÁLIDA</div>
              <div>{expiryDate || "MM/YY"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario con react-hook-form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Datos de tarjeta */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#2C2A29] flex items-center space-x-2">
            <FiCreditCard size={16} />
            <span>Datos de Tarjeta</span>
          </h3>

          <ControlledInput
            name="cardNumber"
            control={control}
            label="Número de tarjeta"
            placeholder="1234 5678 9012 3456"
            icon={FiCreditCard}
            maxLength={23}
            formatValue={formatCardNumber}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="expiryDate"
              control={control}
              label="MM/YY"
              placeholder="12/25"
              maxLength={5}
              formatValue={formatExpiryDate}
              required
            />

            <ControlledCVVInput
              name="cvv"
              control={control}
              label="CVV"
              required
            />
          </div>

          <ControlledInput
            name="cardholderName"
            control={control}
            label="Nombre del titular"
            placeholder="JUAN PÉREZ"
            icon={FiUser}
            formatValue={(value) => value.toUpperCase()}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <ControlledSelect
              name="documentType"
              control={control}
              label="Tipo documento"
              options={documentOptions}
              required
            />

            <ControlledInput
              name="documentNumber"
              control={control}
              label="Número"
              placeholder="12345678"
              formatValue={(value) => value.replace(/\D/g, "")}
              required
            />
          </div>
        </div>

        {/* Datos de entrega */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#2C2A29] flex items-center space-x-2">
            <FiTruck size={16} />
            <span>Datos de Entrega</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="firstName"
              control={control}
              label="Nombre"
              placeholder="Juan"
              icon={FiUser}
              required
            />

            <ControlledInput
              name="lastName"
              control={control}
              label="Apellido"
              placeholder="Pérez"
              required
            />
          </div>

          <ControlledInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="juan@email.com"
            icon={FiMail}
            required
          />

          <ControlledInput
            name="phone"
            control={control}
            label="Teléfono"
            type="tel"
            placeholder="3001234567"
            icon={FiPhone}
            formatValue={formatPhone}
            required
          />

          <ControlledInput
            name="address"
            control={control}
            label="Dirección"
            placeholder="Calle 123 # 45-67"
            icon={FiMapPin}
            required
          />

          <ControlledInput
            name="city"
            control={control}
            label="Ciudad"
            placeholder="Bogotá"
            required
          />
        </div>

        {/* Botones */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <FiX size={16} />
            <span>Cancelar</span>
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isValid}
            className="flex-1 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <span>Continuar</span>
            <FiArrowRight size={16} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
