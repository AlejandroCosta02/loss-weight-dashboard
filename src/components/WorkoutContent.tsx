"use client";

import { useState, useEffect } from "react";
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
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function WorkoutContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [fecha, setFecha] = useState(todayISO());
  const [duracion, setDuracion] = useState("");
  const [actividad, setActividad] = useState(ACTIVIDADES[0].value);
  const [intensidad, setIntensidad] = useState(INTENSIDADES[0].value);
  const [calorias, setCalorias] = useState("");
  const [loading, setLoading] = useState(false);
  const [historialEntrenamientos, setHistorialEntrenamientos] = useState<any[]>([]);
  const [totalCaloriasDia, setTotalCaloriasDia] = useState(0);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  // Fade in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cargar historial de entrenamientos del día
  const cargarHistorial = async () => {
    try {
      setLoadingHistorial(true);
      const res = await fetch(`/api/user/workout?fecha=${fecha}`);
      if (res.ok) {
        const entrenamientos = await res.json();
        setHistorialEntrenamientos(entrenamientos);
        
        // Calcular total de calorías del día
        const total = entrenamientos.reduce((sum: number, entrenamiento: any) => sum + entrenamiento.calorias, 0);
        setTotalCaloriasDia(total);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  // Cargar historial cuando cambie la fecha
  useEffect(() => {
    cargarHistorial();
  }, [fecha]);

  // Calcular calorías basadas en duración e intensidad
  useEffect(() => {
    if (duracion && actividad) {
      const duracionMin = parseInt(duracion);
      const actividadSeleccionada = ACTIVIDADES.find(a => a.value === actividad);
      
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
              {ACTIVIDADES.map(act => {
                const IconComponent = act.icon;
                return (
                  <option key={act.value} value={act.value}>
                    {act.label}
                  </option>
                );
              })}
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

      {/* Historial de entrenamientos del día */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-muted/20 rounded-lg p-6 border border-border/30 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Historial del día
              </h2>
              <p className="text-muted-foreground">
                {new Date(fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {totalCaloriasDia} cal
                </div>
                <div className="text-sm text-muted-foreground">
                  Total del día
                </div>
              </div>
            </div>
          </div>

          {loadingHistorial ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          ) : historialEntrenamientos.length > 0 ? (
            <div className="space-y-4">
              {historialEntrenamientos.map((entrenamiento) => {
                const actividadSeleccionada = ACTIVIDADES.find(a => a.value === entrenamiento.actividad);
                const IconComponent = actividadSeleccionada?.icon || FaDumbbell;
                return (
                  <div key={entrenamiento.id} className="bg-background/50 rounded-lg p-4 border border-border/30">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="text-2xl text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {actividadSeleccionada?.label || entrenamiento.actividad}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {entrenamiento.duracion} min • {entrenamiento.intensidad} intensidad
                          </p>
                        </div>
                      </div>
                      <div className="text-primary font-bold text-lg">
                        {entrenamiento.calorias} cal
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💪</div>
              <p className="text-muted-foreground">
                No hay entrenamientos registrados para este día
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Agrega tu primer entrenamiento arriba!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8 text-muted-foreground text-sm">
        <span>Recuerda: cada entrenamiento cuenta para tu progreso. ¡Sigue así! 💪</span>
      </div>
    </div>
  );
} 