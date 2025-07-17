"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalculator, FaChartLine, FaHandsHelping, FaUser, FaInfoCircle, FaShareAlt, FaEnvelope, FaHeart, FaUsers, FaBullseye, FaTrophy, FaMobile, FaDesktop, FaTablet, FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import LandingCTA from "@/components/LandingCTA";
import CookieConsent from "@/components/CookieConsent";

const navigationItems = [
  { name: "INICIO", href: "#home", current: true },
  { name: "ACERCA DE", href: "#about", current: false },
  { name: "COMPARTIR", href: "#share", current: false },
  { name: "CONTACTO", href: "#contact", current: false },
];

const features = [
  {
    icon: <FaCalculator className="text-2xl" />,
    title: "Calculadora Inteligente",
    description: "Obtén métricas claras y personalizadas para tu progreso"
  },
  {
    icon: <FaChartLine className="text-2xl" />,
    title: "Seguimiento Diario",
    description: "Registra tu avance y visualiza tu transformación"
  },
  {
    icon: <FaHandsHelping className="text-2xl" />,
    title: "Apoyo Personalizado",
    description: "Te acompañamos en cada paso con motivación"
  }
];

const aboutFeatures = [
  {
    icon: <FaHeart className="text-3xl" />,
    title: "Salud Personalizada",
    description: "Cada persona es única. Nuestro sistema se adapta a tus necesidades específicas.",
    color: "from-red-400 to-pink-400"
  },
  {
    icon: <FaBullseye className="text-3xl" />,
    title: "Metas Claras",
    description: "Define objetivos realistas y alcanzables con nuestro sistema de seguimiento.",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <FaTrophy className="text-3xl" />,
    title: "Logros Reales",
    description: "Celebra cada victoria, por pequeña que sea. Cada paso cuenta hacia tu meta.",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: <FaUsers className="text-3xl" />,
    title: "Comunidad de Apoyo",
    description: "Conecta con personas que comparten tus objetivos y motivaciones.",
    color: "from-green-400 to-emerald-400"
  }
];

const shareOptions = [
  {
    icon: <FaTwitter className="text-2xl" />,
    title: "Twitter",
    description: "Comparte tu progreso en redes sociales",
    link: "#",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <FaLinkedin className="text-2xl" />,
    title: "LinkedIn",
    description: "Conecta con profesionales de salud",
    link: "#",
    color: "from-blue-600 to-blue-800"
  },
  {
    icon: <FaInstagram className="text-2xl" />,
    title: "Instagram",
    description: "Inspira a otros con tu transformación",
    link: "#",
    color: "from-purple-400 to-pink-400"
  }
];

const contactInfo = [
  {
    icon: <FaEnvelope className="text-2xl" />,
    title: "Email",
    description: "soporte@kiloapp.com",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <FaMobile className="text-2xl" />,
    title: "Móvil",
    description: "Disponible en iOS y Android",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: <FaDesktop className="text-2xl" />,
    title: "Web",
    description: "Acceso desde cualquier dispositivo",
    color: "from-purple-400 to-pink-400"
  }
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing cookie consent
    const consent = localStorage.getItem('kiloapp-cookie-consent');
    setCookieConsent(consent);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setActiveSection(sectionId.replace('#', ''));
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'share', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCookieAccept = () => {
    setCookieConsent('accepted');
  };

  const handleCookieDecline = () => {
    setCookieConsent('declined');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-foreground">
                <span className="text-primary">Kilo</span>App
              </span>
            </motion.div>

            {/* Navigation Menu */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex space-x-8"
            >
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="pt-16 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Visual */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10"
        >
          {/* Decorative Shapes */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                rotate: [0, -360],
                scale: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-20 left-32 w-20 h-20 bg-pink-400/30 rounded-full blur-xl"
            />
          </div>

          {/* Main Image Placeholder */}
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative w-full max-w-md"
            >
              {/* Main Image - Tape Measure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="w-full h-64 relative main-image-container">
                  <Image
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                    alt="Persona midiendo su progreso con cinta métrica"
                    fill
                    className="object-cover"
                    priority
                    onError={() => {
                      // Hide image and show fallback
                      const imageContainer = document.querySelector('.main-image-container');
                      if (imageContainer) {
                        imageContainer.classList.add('hidden');
                        imageContainer.nextElementSibling?.classList.remove('hidden');
                      }
                    }}
                  />
                </div>
                
                {/* Fallback gradient */}
                <div className="hidden w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center main-image-fallback">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📏</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Seguimiento Inteligente</h3>
                    <p className="text-muted-foreground text-sm">Mide tu progreso con precisión</p>
                  </div>
                </div>
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold"
                >
                  📏 Progreso
                </motion.div>
              </motion.div>

              {/* Floating Food Improvement Image */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-8 -right-8 w-32 h-32 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="w-full h-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
                    alt="Comida saludable y nutritiva"
                    fill
                    className="object-cover"
                    onError={() => {
                      const imageContainer = document.querySelector('.food-container');
                      if (imageContainer) {
                        imageContainer.classList.add('hidden');
                        imageContainer.nextElementSibling?.classList.remove('hidden');
                      }
                    }}
                  />
                </div>
                
                {/* Fallback for food */}
                <div className="hidden w-full h-full bg-gradient-to-br from-green-500/80 to-green-400/60 flex items-center justify-center food-fallback">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🥗</div>
                    <p className="text-xs font-semibold text-white">Nutrición</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/60 to-transparent" />
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-green-600 px-2 py-1 rounded-full text-xs font-bold"
                >
                  🥗 Nutrición
                </motion.div>
              </motion.div>

              {/* Floating Water Image */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-8 -left-8 w-28 h-28 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="w-full h-full relative">
                  <Image
                    src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80"
                    alt="Persona bebiendo agua de una botella"
                    fill
                    className="object-cover"
                    onError={() => {
                      const imageContainer = document.querySelector('.water-container');
                      if (imageContainer) {
                        imageContainer.classList.add('hidden');
                        imageContainer.nextElementSibling?.classList.remove('hidden');
                      }
                    }}
                  />
                </div>
                
                {/* Fallback for water */}
                <div className="hidden w-full h-full bg-gradient-to-br from-cyan-500/80 to-blue-400/60 flex items-center justify-center water-fallback">
                  <div className="text-center">
                    <div className="text-2xl mb-1">💧</div>
                    <p className="text-xs font-semibold text-white">Agua</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/60 to-transparent" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-cyan-600 px-2 py-1 rounded-full text-xs font-bold"
                >
                  💧 Agua
                </motion.div>
              </motion.div>

              {/* Animated particles and waves */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * 100 - 50, 
                      y: Math.random() * 100 - 50,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: Math.random() * 200 - 100, 
                      y: Math.random() * 200 - 100,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${20 + (i * 8)}%`
                    }}
                  />
                ))}
                
                {/* Color waves */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-4 rounded-xl bg-gradient-to-br from-primary/20 via-accent/20 to-transparent"
                />
                
                <motion.div
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute inset-8 rounded-xl bg-gradient-to-br from-accent/20 via-primary/20 to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Section - Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
        >
          <div className="max-w-lg w-full">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-4"
            >
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                DASHBOARD DE PÉRDIDA DE PESO
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-primary">Encuentra tu</span>
              <br />
              <span className="text-foreground">mejor versión</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block ml-2 text-2xl"
              >
                ✨
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-muted-foreground text-lg mb-8 leading-relaxed"
            >
              Transforma tu vida con nuestro dashboard inteligente. Registra tu progreso, 
              visualiza tus metas y alcanza tus objetivos de salud de manera personalizada.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-8"
            >
              <LandingCTA />
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-card/50 border border-border hover:bg-card transition-colors"
                >
                  <div className="text-primary mb-2 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-card/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              ¿Por qué elegir <span className="text-primary">KiloApp</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nuestro enfoque único combina tecnología avanzada con empatía humana para 
              crear una experiencia de pérdida de peso verdaderamente personalizada con KiloApp.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section id="share" className="py-20 bg-gradient-to-br from-background to-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Comparte tu <span className="text-primary">progreso</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conecta con otros, inspira a la comunidad y celebra tus logros juntos con KiloApp.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shareOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${option.color} text-white text-center h-full flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className="mb-4 flex justify-center">
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-card/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              ¿Listo para <span className="text-primary">comenzar</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Únete a miles de personas que ya están transformando sus vidas con KiloApp.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center text-white mb-6 mx-auto shadow-lg`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{info.title}</h3>
                <p className="text-muted-foreground">{info.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <LandingCTA />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-background via-card/30 to-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <span className="font-bold text-xl text-foreground">
                    <span className="text-primary">Kilo</span>App
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Tu compañero inteligente para alcanzar tus metas de salud y bienestar. 
                  Transforma tu vida con tecnología personalizada.
                </p>
              </motion.div>
            </div>

            {/* Product Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-foreground mb-4">Producto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Contacto
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-foreground mb-4">Soporte</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Guías de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="mailto:soporte@kiloapp.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Contactar Soporte
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Términos de Servicio
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Licencias
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-border mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © 2024 KiloApp. Todos los derechos reservados.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaTwitter className="text-lg" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaLinkedin className="text-lg" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaInstagram className="text-lg" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent 
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </div>
  );
}
