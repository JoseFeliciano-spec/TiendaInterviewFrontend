import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiRefreshCw
} from 'react-icons/fi';

interface LayoutInsideProps {
  children: React.ReactElement;
}

export function LayoutInside({ children }: LayoutInsideProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState(3);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigationItems = [
    { icon: FiHome, label: 'Inicio', href: '/' },
    { icon: FiShoppingBag, label: 'Productos', href: '/products' },
    { icon: FiShoppingCart, label: 'Carrito', href: '/carrito', badge: cartItems },
    { icon: FiHeart, label: 'Favoritos', href: '/favoritos' },
    { icon: FiUser, label: 'Mi Cuenta', href: '/cuenta' },
  ];

  const valuePropositions = [
    { icon: FiTruck, text: 'Envío Gratis +$50' },
    { icon: FiShield, text: 'Compra Segura' },
    { icon: FiRefreshCw, text: 'Devolución 30 días' }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    open: { opacity: 1, display: "block" },
    closed: { opacity: 0, transitionEnd: { display: "none" } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de propuesta de valor */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 text-center text-sm"
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

      {/* Header Principal */}
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
                aria-label="Abrir menú"
              >
                <FiMenu size={24} />
              </button>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">TiendaApp</h1>
                  <p className="text-xs text-gray-500">Tu tienda de confianza</p>
                </div>
              </motion.div>
            </div>

            {/* Navegación desktop - Centrada */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.slice(0, 4).map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 relative py-2 px-3 rounded-lg hover:bg-blue-50"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
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

            {/* Acciones del usuario */}
            <div className="flex items-center space-x-3">
              <motion.a
                href="/cuenta"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Mi cuenta"
              >
                <FiUser size={22} />
              </motion.a>
              
              <motion.a
                href="/carrito"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Carrito de compras"
              >
                <FiShoppingCart size={22} />
                {cartItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItems}
                  </motion.span>
                )}
              </motion.a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Overlay para móvil */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar móvil mejorado */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden"
          >
            <div className="p-6 h-full overflow-y-auto">
              {/* Header del sidebar */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">TiendaApp</h2>
                    <p className="text-xs text-gray-500">Tu tienda de confianza</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Navegación principal */}
              <div className="space-y-2 mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Navegación
                </h3>
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: "#f3f4f6" }}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-blue-600 transition-all relative"
                    onClick={toggleSidebar}
                  >
                    <item.icon size={22} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Categorías en sidebar */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Categorías
                </h3>
                {['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros'].map((category, index) => (
                  <motion.a
                    key={category}
                    href={`/categoria/${category.toLowerCase()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: "#f3f4f6" }}
                    className="block p-3 rounded-lg text-gray-600 hover:text-blue-600 transition-all"
                    onClick={toggleSidebar}
                  >
                    {category}
                  </motion.a>
                ))}
              </div>

              {/* Propuesta de valor en sidebar */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Garantías
                </h3>
                <div className="space-y-3">
                  {valuePropositions.map((prop, index) => (
                    <motion.div
                      key={prop.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3 text-gray-600"
                    >
                      <prop.icon size={18} className="text-blue-600" />
                      <span className="text-sm">{prop.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
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

      {/* Footer mejorado */}
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">TiendaApp</h3>
                  <p className="text-gray-400 text-sm">Tu tienda online de confianza</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Ofrecemos productos de la más alta calidad con envío rápido y seguro. 
                Tu satisfacción es nuestra prioridad.
              </p>
              
              {/* Propuestas de valor en footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {valuePropositions.map((prop, index) => (
                  <motion.div
                    key={prop.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <prop.icon size={16} className="text-blue-400" />
                    <span className="text-gray-300">{prop.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">Productos</a></li>
                <li><a href="/ofertas" className="text-gray-400 hover:text-white transition-colors">Ofertas</a></li>
                <li><a href="/nueva-coleccion" className="text-gray-400 hover:text-white transition-colors">Nueva Colección</a></li>
                <li><a href="/marcas" className="text-gray-400 hover:text-white transition-colors">Marcas</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="/envios" className="text-gray-400 hover:text-white transition-colors">Información de Envío</a></li>
                <li><a href="/devoluciones" className="text-gray-400 hover:text-white transition-colors">Devoluciones</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TiendaApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
