/* eslint-disable @typescript-eslint/no-explicit-any */
// components/layout/LayoutInside.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiLogOut,
  FiLogIn,
} from "react-icons/fi";
import { useAppDispatch } from "@/store/redux";
import {
  openLoginModal,
  openRegisterModal,
} from "@/store/slices/auth/authModalSlice";
import { useLogout } from "@/hooks/useAuth";
import { useAuthState } from "@/hooks/useAuthState";
import { useCart } from "@/hooks/cart/useCart";
import { useNavigate } from "react-router-dom";

interface LayoutInsideProps {
  children: React.ReactElement;
}

export function LayoutInside({ children }: LayoutInsideProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuthState();
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { items } = useCart();
  const navigation = useNavigate();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigationItems = [
    { icon: FiHome, label: "Inicio", href: "/" },
    { icon: FiShoppingBag, label: "Productos", href: "/products" },
    {
      icon: FiShoppingCart,
      label: "Carrito",
      href: "/checkout",
      badge: items?.length,
    },
    ...(isAuthenticated
      ? [
          { icon: FiHeart, label: "Historial", href: "/historial" },
          { icon: FiUser, label: "Mi Cuenta", href: "/cuenta" },
        ]
      : []),
  ];

  const valuePropositions = [
    { icon: FiTruck, text: "Envío Gratis +$50k" },
    { icon: FiShield, text: "Compra Segura" },
    { icon: FiRefreshCw, text: "Devolución 30 días" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de propuesta de valor */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-2 text-center text-sm"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-6">
          {valuePropositions.map((prop, index) => (
            <motion.div
              key={prop.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center space-x-2"
            >
              <prop.icon size={16} />
              <span className="font-medium hidden sm:inline">{prop.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Header Principal con Auth */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y menú móvil */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <FiMenu size={24} />
              </button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">TiendaApp</h1>
                  <p className="text-xs text-gray-500">
                    Test Tienda - Pago Seguro
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.slice(0, 4).map((item) => (
                <motion.a
                  key={item.label}
                  onClick={() => {
                    navigation(item?.href);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#00825A] transition-all duration-200 relative py-2 px-3 rounded-lg hover:bg-[#00825A]/10"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {parseInt(item.badge as any) > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.a>
              ))}
            </nav>

            {/* Sección de autenticación */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                // Usuario autenticado
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-[#2C2A29]">
                      Hola, {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Bienvenido de vuelta
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut size={18} />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                  </motion.button>
                </div>
              ) : (
                // Usuario no autenticado
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(openLoginModal())}
                    className="flex items-center space-x-2 px-3 py-2 text-[#00825A] hover:text-[#00825A]/80 rounded-lg hover:bg-[#00825A]/10 transition-colors"
                  >
                    <FiLogIn size={18} />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(openRegisterModal())}
                    className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <span className="hidden sm:inline">Registrarse</span>
                    <span className="sm:hidden">Registro</span>
                  </motion.button>
                </div>
              )}

              {/* Carrito siempre visible */}
              <motion.a
                href="/checkout"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-600 hover:text-[#00825A] transition-colors rounded-lg hover:bg-[#00825A]/10"
              >
                <FiShoppingCart size={22} />
                {items?.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {items?.length}
                  </motion.span>
                )}
              </motion.a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Resto del componente igual... */}
      {/* Sidebar móvil */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header del sidebar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        TiendaApp
                      </h2>
                      <p className="text-xs text-gray-500">Test Tienda</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-gray-600"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Sección de usuario móvil */}
                {isAuthenticated ? (
                  <div className="mb-8 p-4 bg-[#00825A]/10 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-[#00825A] rounded-full flex items-center justify-center">
                        <FiUser className="text-white" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2C2A29]">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        toggleSidebar();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="mb-8 space-y-3">
                    <button
                      onClick={() => {
                        dispatch(openLoginModal());
                        toggleSidebar();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-[#00825A] border border-[#00825A] rounded-lg hover:bg-[#00825A]/10 transition-colors"
                    >
                      <FiLogIn size={18} />
                      <span>Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={() => {
                        dispatch(openRegisterModal());
                        toggleSidebar();
                      }}
                      className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-4 py-3 rounded-lg font-semibold"
                    >
                      Crear Cuenta
                    </button>
                  </div>
                )}

                {/* Navegación móvil */}
                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Navegación
                  </h3>
                  {navigationItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-[#00825A] hover:bg-[#00825A]/10 transition-all relative"
                      onClick={() => {
                        navigation(item?.href);

                        toggleSidebar();
                      }}
                    >
                      <item.icon size={22} />
                      <span className="font-medium">{item.label}</span>
                      {parseInt(item?.badge as any) > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {item?.badge}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="min-h-[calc(100vh-250px)]"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 text-white py-16 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00825A] to-[#B0F2AE] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">TiendaApp</h3>
                  <p className="text-gray-400 text-sm">
                    Test tienda - Pago Seguro
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Plataforma de prueba para el test técnico de tienda. Integración
                completa con Redux Toolkit y TanStack Query.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Test Features</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">
                    ✓ Autenticación completa
                  </span>
                </li>
                <li>
                  <span className="text-gray-400">✓ Checkout con tienda</span>
                </li>
                <li>
                  <span className="text-gray-400">✓ Responsive design</span>
                </li>
                <li>
                  <span className="text-gray-400">✓ Recovery en refresh</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tecnologías</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-400">React + TypeScript</span>
                </li>
                <li>
                  <span className="text-gray-400">Redux Toolkit</span>
                </li>
                <li>
                  <span className="text-gray-400">TanStack Query</span>
                </li>
                <li>
                  <span className="text-gray-400">Framer Motion</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TiendaApp - Test Técnico</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
