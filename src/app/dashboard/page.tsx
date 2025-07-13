"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import WelcomeModal from "@/components/WelcomeModal";
import DashboardContent from "@/components/DashboardContent";
import MealsContent from "@/components/MealsContent";
import WorkoutContent from "@/components/WorkoutContent";
import WaterContent from "@/components/WaterContent";
import { useFloating, offset, shift, Placement } from '@floating-ui/react';
import { useTheme } from "@/context/ThemeContext";

type ActiveTab = 'progress' | 'meals' | 'workout' | 'water';

function Sidebar({ activeTab, onTabChange }: { activeTab: ActiveTab; onTabChange: (tab: ActiveTab) => void }) {
  useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);
  useFloating({
    placement: 'left-start' as Placement,
    middleware: [offset(0), shift()],
    strategy: 'fixed',
  });

  // Animación de aparición
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.add('opacity-0', 'translate-x-[-20px]');
      setTimeout(() => {
        sidebarRef.current?.classList.remove('opacity-0', 'translate-x-[-20px]');
        sidebarRef.current?.classList.add('opacity-100', 'translate-x-0');
      }, 10);
    }
  }, []);

  // Íconos y rutas
  const items = [
    { icon: activeTab === 'progress' ? '/chart-active.png' : '/chart.png', label: 'Progreso', tab: 'progress' as ActiveTab },
    { icon: activeTab === 'meals' ? '/food-active.png' : '/food.png', label: 'Comidas', tab: 'meals' as ActiveTab },
    { icon: activeTab === 'workout' ? '/workout-active.png' : '/workout.png', label: 'Entrenamiento', tab: 'workout' as ActiveTab },
    { icon: activeTab === 'water' ? '/water-active.png' : '/water.png', label: 'Agua', tab: 'water' as ActiveTab },
  ];

  return (
    <>
      {/* Desktop sidebar - new design */}
      <div className="hidden md:flex fixed left-4 top-1/2 h-[80vh] w-20 bg-card shadow-xl rounded-2xl flex-col items-center py-4 -translate-y-1/2">
        <div className="flex flex-col flex-1 justify-between w-full items-center">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => onTabChange(item.tab)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                activeTab === item.tab 
                  ? 'bg-primary/10 shadow-md text-primary scale-110' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:scale-105'
              }`}
              title={item.label}
            >
              <img 
                src={item.icon} 
                alt={item.label} 
                className="w-6 h-6"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="fixed md:hidden bottom-0 left-0 w-full z-40 flex justify-around bg-card shadow-xl py-2 transition-all duration-300">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onTabChange(item.tab)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              activeTab === item.tab
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-primary/5'
            }`}
            title={item.label}
          >
            <img 
              src={item.icon} 
              alt={item.label} 
              className="w-7 h-7"
            />
            <span className="text-xs transition-colors">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('progress');
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
        } catch {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'progress':
        return <DashboardContent />;
      case 'meals':
        return <MealsContent />;
      case 'workout':
        return <WorkoutContent />;
      case 'water':
        return <WaterContent />;
      default:
        return <DashboardContent />;
    }
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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Solo mostrar el modal si onboardingCompleted es false */}
      {onboardingCompleted === false && (
        <WelcomeModal show={showModal} onClose={handleCloseModal} />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {renderContent()}
      </main>
    </div>
  );
} 