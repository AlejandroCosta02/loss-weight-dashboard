"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCookieBite, FaTimes, FaShieldAlt } from "react-icons/fa";

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('kiloapp-cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kiloapp-cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('kiloapp-cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FaCookieBite className="text-primary text-xl" />
                  <h3 className="font-bold text-foreground">Política de Cookies</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Utilizamos cookies esenciales para el funcionamiento de KiloApp, incluyendo autenticación, 
                  preferencias y análisis básico. Al continuar, aceptas nuestra{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Política de Privacidad
                  </a>{" "}
                  y{" "}
                  <a href="/cookie-policy" className="text-primary hover:underline">
                    Política de Cookies
                  </a>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleDecline}
                  className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <FaShieldAlt className="text-sm" />
                  Aceptar Cookies
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 