"use client";

import { useState, useEffect, useCallback } from "react";
import { FaWalking, FaRunning, FaBiking, FaSwimmer, FaPrayingHands, FaDumbbell, FaFutbol, FaMountain, FaMusic, FaFistRaised } from "react-icons/fa";
import toast from "react-hot-toast";

const ACTIVIDADES = [
  { value: "caminar", label: "Caminar", icon: FaWalking },
  { value: "correr", label: "Correr", icon: FaRunning },
  { value: "bicicleta", label: "Bicicleta", icon: FaBiking },
  { value: "nadar", label: "Nadar", icon: FaSwimmer },
  { value: "yoga", label: "Yoga", icon: FaPrayingHands },
  { value: "pesas", label: "Pesas", icon: FaDumbbell },
  { value: "futbol", label: "Fútbol", icon: FaFutbol },
  { value: "montaña", label: "Montaña", icon: FaMountain },
  { value: "baile", label: "Baile", icon: FaMusic },
  { value: "boxeo", label: "Boxeo", icon: FaFistRaised },
];

const INTENSIDADES = [
  { value: "baja", label: "Baja" },
  { value: "moderada", label: "Moderada" },
  { value: "alta", label: "Alta" },
];

function todayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type Workout = {
  id: string;
  fecha: string;
  duracion: number;
  actividad: string;
  intensidad: string;
  calorias: number;
};

export default function WorkoutContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [fecha, setFecha] = useState(todayISO());
  const [duracion, setDuracion] = useState("");
  const [actividad, setActividad] = useState(ACTIVIDADES[0].value);
  const [intensidad, setIntensidad] = useState(INTENSIDADES[0].value);
  const [calorias, setCalorias] = useState("");
  const [loading, setLoading] = useState(false);
  const [historialEntrenamientos, setHistorialEntrenamientos] = useState<Workout[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [filtroActividad, setFiltroActividad] = useState<string>("todas");
  const [mesesExpandidos, setMesesExpandidos] = useState<Set<string>>(new Set());

  // Fade in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cargar historial de entrenamientos del día
  const cargarHistorial = useCallback(async () => {
    try {
      setLoadingHistorial(true);
      const res = await fetch(`/api/user/workout?fecha=${fecha}`);
      if (res.ok) {
        const entrenamientos = await res.json();
        setHistorialEntrenamientos(entrenamientos);
        

      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoadingHistorial(false);
    }
  }, [fecha]);

  // Cargar todos los entrenamientos para el historial completo
  const cargarHistorialCompleto = useCallback(async () => {
    try {
      setLoadingHistorial(true);
      const res = await fetch('/api/user/workout');
      if (res.ok) {
        const entrenamientos = await res.json();
        setHistorialEntrenamientos(entrenamientos);
      }
    } catch (error) {
      console.error("Error cargando historial completo:", error);
    } finally {
      setLoadingHistorial(false);
    }
  }, []);

  // Cargar historial cuando cambie la fecha
  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // Cargar historial completo al montar el componente
  useEffect(() => {
    cargarHistorialCompleto();
  }, [cargarHistorialCompleto]);

  // Agrupar entrenamientos por mes
  const entrenamientosAgrupados = historialEntrenamientos
    .filter(entrenamiento => filtroActividad === "todas" || entrenamiento.actividad === filtroActividad)
    .reduce((grupos, entrenamiento) => {
      const fecha = new Date(entrenamiento.fecha);
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;
      const mesLabel = fecha.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!grupos[mesKey]) {
        grupos[mesKey] = {
          label: mesLabel,
          entrenamientos: []
        };
      }
      grupos[mesKey].entrenamientos.push(entrenamiento);
      return grupos;
    }, {} as Record<string, { label: string; entrenamientos: Workout[] }>);

  // Ordenar meses (más recientes primero)
  const mesesOrdenados = Object.entries(entrenamientosAgrupados)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, data]) => ({ key, ...data }));

  // Toggle expandir/colapsar mes
  const toggleMes = (mesKey: string) => {
    setMesesExpandidos(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(mesKey)) {
        nuevo.delete(mesKey);
      } else {
        nuevo.add(mesKey);
      }
      return nuevo;
    });
  };

  // Calcular calorías basadas en duración e intensidad
  useEffect(() => {
    if (duracion && actividad) {
      const duracionMin = parseInt(duracion);
      
      // Calorías por minuto según actividad e intensidad
      const caloriasPorMinuto = {
        caminar: { baja: 3, moderada: 4, alta: 5 },
        correr: { baja: 8, moderada: 10, alta: 12 },
        bicicleta: { baja: 6, moderada: 8, alta: 10 },
        nadar: { baja: 7, moderada: 9, alta: 11 },
        yoga: { baja: 2, moderada: 3, alta: 4 },
        pesas: { baja: 4, moderada: 6, alta: 8 },
        futbol: { baja: 8, moderada: 10, alta: 12 },
        montaña: { baja: 6, moderada: 8, alta: 10 },
        baile: { baja: 5, moderada: 7, alta: 9 },
        boxeo: { baja: 8, moderada: 10, alta: 12 },
      };
      
      const caloriasCalculadas = duracionMin * (caloriasPorMinuto[actividad as keyof typeof caloriasPorMinuto]?.[intensidad as keyof typeof caloriasPorMinuto.caminar] || 5);
      setCalorias(caloriasCalculadas.toString());
    }
  }, [duracion, actividad, intensidad]);

  // Guardar entrenamiento
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!duracion || !calorias) {
      toast.error("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          duracion: parseInt(duracion),
          actividad,
          intensidad,
          calorias: parseFloat(calorias),
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Respuesta inesperada del servidor");
      }
      if (!res.ok) {
        toast.error(data?.error || "Error al guardar");
        return;
      }
      toast.success("¡Entrenamiento registrado! 💪");
      setDuracion("");
      setCalorias("");
      // Recargar historial después de guardar
      cargarHistorial();
      
      // Disparar evento personalizado para actualizar MainContent
      window.dispatchEvent(new CustomEvent('workoutDataUpdated'));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Registro de Entrenamientos</h1>
        <p className="text-muted-foreground text-lg">Lleva un control de tu actividad física diaria</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
            <input type="date" className="input w-full" value={fecha} onChange={e => setFecha(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Duración (minutos)</label>
            <input type="number" className="input w-full" value={duracion} onChange={e => setDuracion(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Actividad</label>
            <select className="input w-full" value={actividad} onChange={e => setActividad(e.target.value)} required>
              {ACTIVIDADES.map(act => (
                <option key={act.value} value={act.value}>
                  {act.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Intensidad</label>
            <select className="input w-full" value={intensidad} onChange={e => setIntensidad(e.target.value)} required>
              {INTENSIDADES.map(int => <option key={int.value} value={int.value}>{int.label}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Calorías estimadas:</span>
            <span className="text-lg font-bold text-primary">{calorias || "0"} cal</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !duracion || !calorias}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
        >
          {loading ? "Guardando..." : "Guardar Entrenamiento"}
        </button>
      </form>

      {/* Historial completo de entrenamientos */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-muted/20 rounded-lg p-6 border border-border/30 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Historial de Entrenamientos
              </h2>
              <p className="text-muted-foreground">
                Todos tus entrenamientos organizados por mes
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Filtrar por actividad</label>
                <select 
                  className="input text-sm" 
                  value={filtroActividad} 
                  onChange={e => setFiltroActividad(e.target.value)}
                >
                  <option value="todas">Todas las actividades</option>
                  {ACTIVIDADES.map(act => (
                    <option key={act.value} value={act.value}>
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loadingHistorial ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          ) : mesesOrdenados.length > 0 ? (
            <div className="space-y-4">
              {mesesOrdenados.map(({ key, label, entrenamientos }) => {
                const isExpanded = mesesExpandidos.has(key);
                const totalCaloriasMes = entrenamientos.reduce((sum, e) => sum + e.calorias, 0);
                
                return (
                  <div key={key} className="bg-background/50 rounded-lg border border-border/30 overflow-hidden">
                    <button
                      onClick={() => toggleMes(key)}
                      className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-foreground">{label}</span>
                          <span className="text-sm text-muted-foreground">
                            ({entrenamientos.length} entrenamiento{entrenamientos.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-primary font-medium">
                            {totalCaloriasMes} cal total
                          </span>
                          <svg 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t border-border/30 p-4 space-y-3">
                        {entrenamientos
                          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                          .map((entrenamiento) => {
                            const actividadSeleccionada = ACTIVIDADES.find(a => a.value === entrenamiento.actividad);
                            const IconComponent = actividadSeleccionada?.icon || FaDumbbell;
                            const fechaLocal = new Date(entrenamiento.fecha).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            });
                            
                            return (
                              <div key={entrenamiento.id} className="bg-muted/30 rounded-lg p-3 border border-border/20">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center space-x-3">
                                    <IconComponent className="text-xl text-primary" />
                                    <div>
                                      <h4 className="font-medium text-foreground">
                                        {actividadSeleccionada?.label || entrenamiento.actividad}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {entrenamiento.duracion} min • {entrenamiento.intensidad} intensidad
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {fechaLocal}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-primary font-bold">
                                    {entrenamiento.calorias} cal
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💪</div>
              <p className="text-muted-foreground">
                No hay entrenamientos registrados
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Agrega tu primer entrenamiento arriba!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8 text-muted-foreground text-sm">
        <span>Cada entrenamiento que registras es un paso hacia tus objetivos de fitness. La consistencia es la clave del éxito, y cada sesión de ejercicio contribuye a mejorar tu salud física y mental. Recuerda que el progreso no siempre es lineal, pero cada esfuerzo cuenta en tu camino hacia una vida más saludable y activa.</span>
      </div>
    </div>
  );
} 