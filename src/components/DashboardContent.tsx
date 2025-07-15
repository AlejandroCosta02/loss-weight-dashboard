"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import WeightChart from "@/components/WeightChart";
import WeightEntryForm from "@/components/WeightEntryForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

interface UserData {
  weight: number;
  goal: string;
  dailyWeights: WeightEntry[];
}

export default function DashboardContent({ onProfileClick }: { onProfileClick?: () => void }) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightAdded = () => {
    fetchUserData();
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Necesitas completar tu perfil primero
          </h1>
          <p className="text-muted-foreground mb-6">
            Para comenzar a registrar tu progreso, completa tu información en el perfil.
          </p>
          <button
            onClick={onProfileClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold transition-all shadow-lg"
          >
            Completar perfil
          </button>
        </div>
      </div>
    );
  }

  const goalWeight = parseFloat(userData.goal) || 0;
  const currentWeight = userData.weight || 0;
  const weightEntries = userData.dailyWeights || [];

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} w-full mx-auto`}>

      {/* Main Title and Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Mi Progreso
        </h1>
        <p className="text-muted-foreground text-lg">
          Lleva un control de tu evolución y tus registros de peso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Peso Actual</h3>
          <p className="text-2xl font-bold text-primary">{currentWeight} kg</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Peso Objetivo</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--destructive)' }}>{goalWeight} kg</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Registros</h3>
          <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{weightEntries.length}</p>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Progreso</h3>
          <p className="text-2xl font-bold text-primary">
            {currentWeight > 0 && goalWeight > 0 
              ? `${Math.abs(((currentWeight - goalWeight) / goalWeight) * 100).toFixed(1)}%`
              : "0%"
            }
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 mb-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Evolución de tu peso</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium transition-all shadow-sm text-sm"
          >
            + Agregar registro
          </button>
        </div>
        
        {weightEntries.length > 0 ? (
          <WeightChart 
            data={weightEntries} 
            goalWeight={goalWeight}
            currentWeight={currentWeight}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Comienza tu seguimiento
            </h3>
            <p className="text-muted-foreground mb-4">
              Agrega tu primer registro de peso para ver tu progreso
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold transition-all shadow-lg"
            >
              Agregar mi primer peso
            </button>
          </div>
        )}
      </div>

      {/* Weight Entries List */}
      {weightEntries.length > 0 && (
        <div className="p-6 w-full">
          <h2 className="text-xl font-semibold text-foreground mb-6">Historial de registros</h2>
          <div className="mb-4 text-base text-muted-foreground">El progreso no siempre es lineal, pero cada registro cuenta. Mantente constante, celebra cada avance y recuerda que los pequeños pasos diarios construyen grandes resultados a lo largo del tiempo.</div>
          <div className="space-y-3 w-full">
            {weightEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-4 w-full">
                  <div>
                    <p className="font-medium text-foreground">
                      {format(new Date(entry.date), "EEEE, d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{entry.weight} kg</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Weight Entry Modal */}
      {showForm && (
        <WeightEntryForm
          onClose={() => setShowForm(false)}
          onWeightAdded={handleWeightAdded}
          currentWeight={currentWeight}
          goalWeight={goalWeight}
        />
      )}
    </div>
  );
} 