"use client";

import { useState, useEffect } from "react";

export default function WaterContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Registro de Hidratación
        </h1>
        <p className="text-muted-foreground text-lg">
          Lleva un control de tu consumo de agua diario
        </p>
      </div>

      {/* Coming Soon */}
      <div className="bg-card rounded-lg p-12 border border-border shadow-sm text-center">
        <div className="text-6xl mb-6">💧</div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Próximamente
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          Estamos trabajando en esta funcionalidad para que puedas registrar tu consumo de agua y mantener una hidratación óptima.
        </p>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full inline-block">
          En desarrollo
        </div>
      </div>
    </div>
  );
} 