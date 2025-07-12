"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import WelcomeModal from "@/components/WelcomeModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const modalShownRef = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Verificar si el usuario ya completó el onboarding
  useEffect(() => {
    async function checkOnboarding() {
      if (session && session.user?.email && !modalShownRef.current) {
        try {
          const res = await fetch("/api/user/onboarding", { method: "GET" });
          const data = await res.json();
          setOnboardingCompleted(data.onboardingCompleted);
          if (!data.onboardingCompleted) {
            setShowModal(true);
            modalShownRef.current = true;
          }
        } catch (e) {
          setShowModal(true); // fallback: mostrar modal si hay error
          modalShownRef.current = true;
        } finally {
          setOnboardingChecked(true);
        }
      }
    }
    if (status === "authenticated" && !onboardingChecked) {
      checkOnboarding();
    }
  }, [session, status, onboardingChecked]);

  // Marcar onboarding como completado
  const handleCloseModal = async () => {
    setShowModal(false);
    await fetch("/api/user/onboarding", { method: "POST" });
    setOnboardingCompleted(true);
    modalShownRef.current = true;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Solo mostrar el modal si onboardingCompleted es false */}
      {onboardingCompleted === false && (
        <WelcomeModal show={showModal} onClose={handleCloseModal} />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            ¡Hola, {session.user?.name || "Usuario"}!
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm sm:text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Bienvenido a tu dashboard personal de seguimiento de peso.
          </p>
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="bg-card shadow-lg rounded-lg p-4 sm:p-6 border border-border">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
              Tu información
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p className="text-base sm:text-lg text-foreground">{session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base sm:text-lg text-foreground break-all">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="bg-card shadow-lg rounded-lg p-4 sm:p-6 border border-border">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
              Funcionalidades disponibles
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium text-foreground text-sm sm:text-base">Seguimiento de peso</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Registra tu peso diario y visualiza tu progreso
                </p>
                <button
                  onClick={() => router.push("/seguimiento")}
                  className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium transition-colors"
                >
                  Ir al seguimiento
                </button>
              </div>
              <div className="border border-border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium text-foreground text-sm sm:text-base">Gráficos interactivos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Visualiza tu progreso con gráficos motivadores
                </p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-background/50">
                <h3 className="font-medium text-foreground text-sm sm:text-base">Metas personalizadas</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Establece y alcanza tus objetivos de peso
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 