"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface WaterIntake {
  id: string;
  fecha: string;
  cantidadTotal: number;
  objetivoEstimado: number;
  registros: WaterRecord[];
}

interface WaterRecord {
  id: string;
  hora: string;
  cantidad: number;
}

interface UserData {
  gender: string;
  age: number;
  weight: number;
  activityLevel: string;
}

export default function WaterContent() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [waterIntake, setWaterIntake] = useState<WaterIntake | null>(null);
  const [cantidad, setCantidad] = useState<number>(250);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Cargar datos del usuario y consumo de agua
  const cargarDatos = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);
      
      // Cargar datos del usuario
      const userResponse = await fetch('/api/user/profile');
      if (userResponse.ok) {
        const userDataResponse = await userResponse.json();
        setUserData(userDataResponse.userData);
      }

      // Cargar consumo de agua
      const waterResponse = await fetch(`/api/user/water?fecha=${fecha}`);
      if (waterResponse.ok) {
        const data = await waterResponse.json();
        setWaterIntake(data.waterIntake);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, fecha]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Calcular recomendación personalizada
  const calcularRecomendacion = useCallback((userData: UserData): number => {
    let base = userData.gender === "masculino" ? 3.0 : 2.2;
    
    if (userData.age >= 50) base -= 0.2;
    if (userData.activityLevel === "alta") base += 0.5;
    
    const aguaDiariaRecomendada = base + (userData.weight * 0.01);
    return aguaDiariaRecomendada * 1000; // Convertir a mililitros
  }, []);

  // Registrar consumo de agua
  const registrarAgua = async () => {
    if (!session?.user?.email || cantidad <= 0) return;

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch('/api/user/water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha,
          cantidad
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWaterIntake(data.waterIntake);
        setMessage("¡Agua registrada exitosamente! 💧");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error al registrar agua:", error);
      setMessage("Error al registrar el consumo de agua");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular porcentaje de progreso
  const calcularProgreso = (): number => {
    if (!waterIntake || waterIntake.objetivoEstimado === 0) return 0;
    return Math.min((waterIntake.cantidadTotal / waterIntake.objetivoEstimado) * 100, 100);
  };

  // Obtener color de la barra de progreso
  const obtenerColorProgreso = (): string => {
    const progreso = calcularProgreso();
    if (progreso >= 100) return "bg-green-500";
    if (progreso >= 75) return "bg-blue-500";
    if (progreso >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Obtener mensaje motivacional
  const obtenerMensajeMotivacional = (): string => {
    const progreso = calcularProgreso();
    if (progreso >= 100) return "¡Excelente! Has alcanzado tu objetivo de hidratación 🎉";
    if (progreso >= 75) return "¡Muy bien! Casi alcanzas tu meta de hidratación 💪";
    if (progreso >= 50) return "¡Vas por buen camino! Sigue hidratándote 💧";
    return "¡Comienza tu día con un vaso de agua! 🚰";
  };

  // Formatear cantidad en formato legible
  const formatearCantidad = (ml: number): string => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)} L`;
    }
    return `${ml} ml`;
  };

  // Formatear hora
  const formatearHora = (hora: string): string => {
    return new Date(hora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const progreso = calcularProgreso();
  const colorProgreso = obtenerColorProgreso();
  const mensajeMotivacional = obtenerMensajeMotivacional();

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

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Información de recomendación */}
        {userData && (
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Tu Recomendación Personalizada
              </h2>
              <div className="text-2xl">🧠💧</div>
            </div>
            <p className="text-muted-foreground">
              Hoy tu cuerpo necesita aprox. {formatearCantidad(calcularRecomendacion(userData))} de agua
            </p>
          </div>
        )}

        {/* Formulario de ingreso */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Registrar Consumo de Agua
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cantidad (ml)
              </label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min="50"
                max="2000"
                step="50"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={registrarAgua}
                disabled={isLoading || cantidad <= 0}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Registrando..." : "Agregar Agua"}
              </button>
            </div>
          </div>

          {/* Botones rápidos */}
          <div className="flex flex-wrap gap-2">
            {[250, 500, 750, 1000].map((cant) => (
              <button
                key={cant}
                onClick={() => setCantidad(cant)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  cantidad === cant
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cant} ml
              </button>
            ))}
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Progreso del día */}
        {waterIntake && (
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Progreso del Día
              </h2>
              <div className="text-2xl">💧</div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {formatearCantidad(waterIntake.cantidadTotal)} / {formatearCantidad(waterIntake.objetivoEstimado)}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {progreso.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${colorProgreso}`}
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              {mensajeMotivacional}
            </p>
          </div>
        )}

        {/* Historial del día */}
        {waterIntake && waterIntake.registros.length > 0 && (
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Registros del Día
            </h2>
            
            <div className="space-y-2">
              {waterIntake.registros.map((registro) => (
                <div
                  key={registro.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💧</span>
                    <span className="font-medium text-foreground">
                      {formatearCantidad(registro.cantidad)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatearHora(registro.hora)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consejos de hidratación */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Consejos de Hidratación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌅</span>
                <span className="text-sm text-muted-foreground">
                  Bebe un vaso de agua al despertar
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏃‍♂️</span>
                <span className="text-sm text-muted-foreground">
                  Hidrátate antes, durante y después del ejercicio
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🍽️</span>
                <span className="text-sm text-muted-foreground">
                  Bebe agua con cada comida
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🌙</span>
                <span className="text-sm text-muted-foreground">
                  Reduce el consumo 2 horas antes de dormir
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 