/* eslint-disable @typescript-eslint/no-explicit-any */
import {  useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiX, 
  FiMail, 
  FiUser, 
  FiShield,
  FiLoader
} from 'react-icons/fi';
import { type RootState } from '@/store';
import { closeAuthModal, switchToLogin, switchToRegister } from '@/store/slices/auth/authModalSlice';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { useLoginForm, useRegisterForm } from '@/hooks/useAuthForm';
import { ControlledInput } from '@/components/Form';
import { ControlledPasswordInput } from '@/components/Form';

export function AuthModal() {
  const dispatch = useDispatch();
  const { isOpen, mode, loading } = useSelector((state: RootState) => state.authModal);
  
  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Side effects para las mutaciones usando useEffect (nueva práctica)
  useEffect(() => {
    if (loginMutation.isSuccess) {
      // La lógica de éxito ya está en onSuccess de la mutation
      // Reset form on success
      loginForm.reset();
    }
  }, [loginMutation.isSuccess, loginForm]);

  useEffect(() => {
    if (registerMutation.isSuccess) {
      // Reset form on success  
      registerForm.reset();
    }
  }, [registerMutation.isSuccess, registerForm]);

  const handleClose = () => {
    dispatch(closeAuthModal());
    // Reset forms when closing
    loginForm.reset();
    registerForm.reset();
  };

  const handleLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  const handleRegisterSubmit = registerForm.handleSubmit((data : any) => {
    const { confirmPassword, ...registerData } = data;
    console.log(confirmPassword);
    registerMutation.mutate(registerData);
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center">
                <FiShield className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2C2A29]">
                  {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'login' 
                    ? 'Accede a tu cuenta de TiendaApp'
                    : 'Únete a la comunidad TiendaApp'
                  }
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX size={20} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'login' ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <ControlledInput
                  name="email"
                  control={loginForm.control}
                  label="Correo Electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  icon={FiMail}
                  required
                />

                <ControlledPasswordInput
                  name="password"
                  control={loginForm.control}
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  required
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
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

                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => dispatch(switchToRegister())}
                      className="text-[#00825A] font-semibold hover:underline"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
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

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || registerMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
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

                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => dispatch(switchToLogin())}
                      className="text-[#00825A] font-semibold hover:underline"
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Terms */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Al {mode === 'login' ? 'iniciar sesión' : 'crear una cuenta'}, aceptas nuestros{' '}
                <a href="/terminos" className="text-[#00825A] hover:underline">
                  Términos y Condiciones
                </a>{' '}
                y{' '}
                <a href="/privacidad" className="text-[#00825A] hover:underline">
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
