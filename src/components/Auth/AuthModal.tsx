/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FiX, FiMail, FiUser, FiShield, FiLoader } from "react-icons/fi";
import { type RootState } from "@/store";
import {
  closeAuthModal,
  switchToLogin,
  switchToRegister,
} from "@/store/slices/auth/authModalSlice";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { useLoginForm, useRegisterForm } from "@/hooks/useAuthForm";
import { ControlledInput } from "@/components/Form";
import { ControlledPasswordInput } from "@/components/Form";

export function AuthModal() {
  const dispatch = useDispatch();
  const { isOpen, mode, loading } = useSelector(
    (state: RootState) => state.authModal
  );

  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleClose = () => {
    dispatch(closeAuthModal());
    // Reset forms when closing
    loginForm.reset();
    registerForm.reset();
  };

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response) {
        loginForm.reset();
        dispatch(closeAuthModal());
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  });

  const handleRegisterSubmit = registerForm.handleSubmit(async (data: any) => {
    const { confirmPassword, ...registerData } = data;
    console.log(confirmPassword);
    try {
      await registerMutation.mutateAsync(registerData);

      // Pre-llenar email en login y cambiar modo
      loginForm.reset({
        email: data.email,
        password: "",
      });
      registerForm.reset();
      dispatch(switchToLogin());
    } catch (error) {
      console.error("Error en registro:", error);
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-start md:items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col max-h-[calc(100vh-theme(spacing.8))] md:max-h-[90vh] mt-4 md:mt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Centrado */}
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-200 flex-shrink-0">
            {" "}
            {/* Slightly more visible border, adjusted padding for smaller screens */}
            <div className="flex items-center space-x-3">
              {" "}
              {/* Removed flex-1 from here to allow natural sizing unless it breaks alignment */}
              <div className="w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center flex-shrink-0">
                <FiShield className="text-white" size={20} />
              </div>
              <div className="flex-1">
                {" "}
                {/* Title/subtitle take available space, text-left by default, center individual text elements if needed */}
                <h2 className="text-lg md:text-xl font-bold text-[#2C2A29] text-center md:text-left">
                  {" "}
                  {/* Responsive text alignment */}
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </h2>
                <p className="text-sm text-gray-600 text-center md:text-left">
                  {mode === "login"
                    ? "Accede a tu cuenta de TiendaApp"
                    : "Únete a la comunidad TiendaApp"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }} // Enhanced hover
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors flex-shrink-0" // Rounded-full for close button
              aria-label="Cerrar modal"
            >
              <FiX size={22} /> {/* Slightly larger icon */}
            </motion.button>
          </div>

          {/* Content - Scrollable */}
          <div className="p-5 md:p-6 overflow-y-auto flex-grow">
            {" "}
            {/* Added flex-grow to take available space */}
            <div className="max-w-sm mx-auto">
              {" "}
              {/* Form content constrained and centered */}
              {mode === "login" ? (
                // Login Form
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <ControlledInput
                      name="email"
                      key={"email-login"}
                      control={loginForm.control}
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tu@email.com"
                      icon={FiMail}
                      required
                    />
                    <ControlledPasswordInput
                      name="password"
                      key={"password-login"}
                      control={loginForm.control}
                      label="Contraseña"
                      placeholder="Tu contraseña"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0px 5px 15px rgba(0, 130, 90, 0.3)",
                      }} // Enhanced shadow on hover
                      whileTap={{ scale: 0.98 }}
                      disabled={loading || loginMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#00825A] to-[#90E0C0] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#00825A]/50 focus:ring-offset-2" // Adjusted gradient end, added focus states
                    >
                      {loading || loginMutation.isPending ? (
                        <>
                          <FiLoader className="animate-spin" size={18} />
                          <span>Iniciando sesión...</span>
                        </>
                      ) : (
                        <>
                          <FiShield size={18} />
                          <span>Iniciar Sesión</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-600 text-sm">
                      ¿No tienes cuenta?{" "}
                      <button
                        type="button"
                        onClick={() => dispatch(switchToRegister())}
                        className="text-[#00825A] font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-[#00825A] rounded-sm"
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <ControlledInput
                      name="name"
                      control={registerForm.control}
                      label="Nombre Completo"
                      placeholder="Juan Pérez"
                      icon={FiUser}
                      required
                    />
                    <ControlledInput
                      name="email"
                      control={registerForm.control}
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tu@email.com"
                      icon={FiMail}
                      required
                    />
                    <ControlledPasswordInput
                      name="password"
                      control={registerForm.control}
                      label="Contraseña"
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <ControlledPasswordInput
                      name="confirmPassword"
                      control={registerForm.control}
                      label="Confirmar Contraseña"
                      placeholder="Repite tu contraseña"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0px 5px 15px rgba(0, 130, 90, 0.3)",
                      }} // Enhanced shadow on hover
                      whileTap={{ scale: 0.98 }}
                      disabled={loading || registerMutation.isPending}
                      className="w-full bg-gradient-to-r from-[#00825A] to-[#90E0C0] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#00825A]/50 focus:ring-offset-2" // Adjusted gradient end, added focus states
                    >
                      {loading || registerMutation.isPending ? (
                        <>
                          <FiLoader className="animate-spin" size={18} />
                          <span>Creando cuenta...</span>
                        </>
                      ) : (
                        <>
                          <FiUser size={18} />
                          <span>Crear Cuenta</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-600 text-sm">
                      ¿Ya tienes cuenta?{" "}
                      <button
                        type="button"
                        onClick={() => dispatch(switchToLogin())}
                        className="text-[#00825A] font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-[#00825A] rounded-sm"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
            {/* Terms - Centrado y dentro del area de scroll */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              {" "}
              {/* Slightly more visible border */}
              <p className="text-xs text-gray-500 text-center leading-relaxed max-w-xs mx-auto">
                {" "}
                {/* Constrain width for better readability */}
                Al {mode === "login" ? "iniciar sesión" : "crear una cuenta"},
                aceptas nuestros{" "}
                <a
                  href="/terminos"
                  className="text-[#00825A] hover:underline focus:outline-none focus:ring-1 focus:ring-[#00825A] rounded-sm"
                >
                  Términos y Condiciones
                </a>{" "}
                y{" "}
                <a
                  href="/privacidad"
                  className="text-[#00825A] hover:underline focus:outline-none focus:ring-1 focus:ring-[#00825A] rounded-sm"
                >
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
