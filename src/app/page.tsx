"use client";
import Image from "next/image";
import { FaCalculator, FaChartLine, FaHandsHelping } from "react-icons/fa";
import LandingCTA from "@/components/LandingCTA";

const images = [
  {
    src: "https://cdn.pixabay.com/photo/2017/01/20/15/06/scale-1991277_1280.png",
    alt: "Báscula",
  },
  {
    src: "https://cdn.pixabay.com/photo/2016/11/29/09/32/athlete-1867749_1280.jpg",
    alt: "Zapatillas deportivas",
  },
  {
    src: "https://cdn.pixabay.com/photo/2017/05/07/08/56/healthy-food-2290814_1280.jpg",
    alt: "Comida saludable",
  },
  {
    src: "https://cdn.pixabay.com/photo/2014/12/21/23/50/weight-loss-579201_1280.png",
    alt: "Silueta",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-8 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 drop-shadow-sm">
          Tu camino hacia el cambio comienza hoy
        </h1>
        <p className="text-muted-foreground mb-6">
          Calcula tu progreso, visualiza tu meta, y transforma tu salud
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
          {images.map((img, i) => (
            <div
              key={img.alt}
              className={`w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-xl overflow-hidden shadow-lg bg-card border border-border flex items-center justify-center transform scale-90 hover:scale-105 transition-all duration-500 animate-zoomIn`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={140}
                height={140}
                className="object-cover w-full h-full"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        <LandingCTA />
      </section>
      {/* Beneficios */}
      <section className="max-w-4xl mx-auto py-8 sm:py-10 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex flex-col items-center text-center">
          <FaCalculator className="text-3xl sm:text-4xl text-primary mb-2" />
          <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">Calculadora inteligente</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Obtén métricas claras y personalizadas para tu progreso.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <FaChartLine className="text-3xl sm:text-4xl text-primary mb-2" />
          <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">Seguimiento diario</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Registra tu avance y visualiza tu transformación día a día.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <FaHandsHelping className="text-3xl sm:text-4xl text-secondary mb-2" />
          <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">Apoyo personalizado</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Te acompañamos en cada paso con motivación y empatía.</p>
        </div>
      </section>
    </>
  );
}
