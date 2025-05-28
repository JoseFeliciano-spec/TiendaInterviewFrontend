import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiCreditCard,
  FiStar,
  FiArrowRight,
  FiCheck,
  FiZap,
  FiHeart,
} from "react-icons/fi";

export function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "María González",
      role: "Emprendedora",
      content:
        "La mejor plataforma para mi tienda online. Pagos seguros y rápidos.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "CEO TechStart",
      content:
        "Integración perfecta con nuestro sistema. Excelente experiencia.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "Diseñadora",
      content: "Interfaz intuitiva y proceso de pago sin complicaciones.",
      rating: 5,
    },
  ];

  const products = [
    {
      id: 1,
      name: "Smartphone Pro Max",
      price: "$899.999",
      originalPrice: "$1.199.999",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Electrónicos",
      stock: 15,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Laptop Gaming Ultra",
      price: "$2.499.999",
      originalPrice: "$2.899.999",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Computadores",
      stock: 8,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Audífonos Inalámbricos",
      price: "$299.999",
      originalPrice: "$399.999",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Audio",
      stock: 25,
      rating: 4.7,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#B0F2AE] via-[#99D1FC] to-[#DFFF61] py-20 lg:py-32">
          <motion.div
            style={{ y, opacity }}
            className="absolute inset-0 bg-black/5"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-[#2C2A29] leading-tight"
                  >
                    Tu Tienda Online
                    <span className="block text-[#00825A]">de Confianza</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-[#2C2A29]/80 max-w-md"
                  >
                    Descubre productos increíbles con pagos seguros, envío
                    gratis y la mejor experiencia de compra online.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0, 130, 90, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#00825A] text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:bg-[#00825A]/90 transition-colors"
                  >
                    <FiShoppingBag size={20} />
                    <span>Explorar Productos</span>
                    <FiArrowRight size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-[#00825A] text-[#00825A] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00825A] hover:text-white transition-all duration-300"
                  >
                    Ver Ofertas
                  </motion.button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-6 text-[#2C2A29]/70"
                >
                  <div className="flex items-center space-x-2">
                    <FiShield className="text-[#00825A]" size={20} />
                    <span className="text-sm font-medium">Pagos Seguros</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiTruck className="text-[#00825A]" size={20} />
                    <span className="text-sm font-medium">Envío Gratis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCheck className="text-[#00825A]" size={20} />
                    <span className="text-sm font-medium">
                      Garantía 30 días
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Experiencia de compra online"
                    className="rounded-2xl shadow-2xl w-full"
                    loading="eager"
                  />
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-[#DFFF61] rounded-full opacity-80"
                />
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#99D1FC] rounded-full opacity-60"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29] mb-4">
                ¿Por qué elegir TiendaApp?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ofrecemos la mejor experiencia de compra online con tecnología
                de vanguardia
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiShield,
                  title: "Pagos Seguros",
                  description:
                    "Tecnología de encriptación avanzada para proteger tus datos",
                  color: "#00825A",
                },
                {
                  icon: FiZap,
                  title: "Entrega Rápida",
                  description:
                    "Recibe tus productos en tiempo récord con nuestro sistema logístico",
                  color: "#B0F2AE",
                },
                {
                  icon: FiHeart,
                  title: "Atención 24/7",
                  description:
                    "Soporte personalizado las 24 horas, los 7 días de la semana",
                  color: "#99D1FC",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon size={32} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C2A29] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-gradient-to-br from-[#FAFAFA] to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29] mb-4">
                Productos Destacados
              </h2>
              <p className="text-xl text-gray-600">
                Descubre nuestras mejores ofertas y productos más populares
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-[#00825A] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#DFFF61] text-[#2C2A29] px-3 py-1 rounded-full text-sm font-bold">
                      Stock: {product.stock}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.rating})
                      </span>
                    </div>

                    <h3 className="text-lg font-bo
                    ld text-[#2C2A29] mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl font-bold text-[#00825A]">
                        {product.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => {
                        window.open('https://github.com/JoseFeliciano-spec?tab=repositories', '_blank', 'noopener,noreferrer');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <FiShoppingBag size={18} />
                      <span>Ir al github</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-r from-[#00825A] to-[#B0F2AE]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-16"
            >
              Lo que dicen nuestros clientes
            </motion.h2>

            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <FiStar
                      key={i}
                      size={24}
                      className="text-[#DFFF61] fill-current"
                    />
                  )
                )}
              </div>

              <p className="text-xl mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div>
                <p className="font-bold text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-white/80">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Ver testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2A29]">
                ¿Listo para empezar a comprar?
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Únete a miles de clientes satisfechos y descubre por qué
                TiendaApp es la mejor opción para tus compras online.
              </p>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(0, 130, 90, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#00825A] to-[#B0F2AE] text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <FiCreditCard size={24} />
                <span>Comprar Ahora</span>
                <FiArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
