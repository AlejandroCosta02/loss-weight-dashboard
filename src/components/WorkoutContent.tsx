"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaWalking, FaRunning, FaBiking, FaSwimmer, FaPrayingHands, FaDumbbell, FaFutbol, FaMountain, FaMusic, FaFistRaised } from "react-icons/fa";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format, subDays, subMonths, startOfDay } from "date-fns";
import { es } from "date-fns/locale/es";
import type { JSX } from "react";

type METsType = {
  [key: string]: {
    [intensidad: string]: number | JSX.Element;
    Baja: number;
    Moderada: number;
    Alta: number;
    icon: JSX.Element;
  };
};

interface Workout {
  id: string;
  userId: string;
  fecha: string;
  duracion: number;
  actividad: string;
  intensidad: string;
  calorias: number;
}

const METs: METsType = {
  Caminata: { Baja: 2.5, Moderada: 3.5, Alta: 4.5, icon: <FaWalking className="inline mr-2" /> },
  Trote: { Baja: 6.0, Moderada: 7.0, Alta: 8.0, icon: <FaRunning className="inline mr-2" /> },
  Ciclismo: { Baja: 4.0, Moderada: 6.5, Alta: 9.0, icon: <FaBiking className="inline mr-2" /> },
  Natación: { Baja: 6.0, Moderada: 8.0, Alta: 10.0, icon: <FaSwimmer className="inline mr-2" /> },
  Yoga: { Baja: 2.5, Moderada: 3.0, Alta: 4.0, icon: <FaPrayingHands className="inline mr-2" /> },
  CrossFit: { Baja: 5.5, Moderada: 7.0, Alta: 9.0, icon: <FaDumbbell className="inline mr-2" /> },
  Fútbol: { Baja: 6.0, Moderada: 7.5, Alta: 10.0, icon: <FaFutbol className="inline mr-2" /> },
  Escalada: { Baja: 5.0, Moderada: 6.5, Alta: 8.5, icon: <FaMountain className="inline mr-2" /> },
  Baile: { Baja: 3.0, Moderada: 5.0, Alta: 7.0, icon: <FaMusic className="inline mr-2" /> },
  Kickboxing: { Baja: 6.0, Moderada: 8.0, Alta: 10.0, icon: <FaFistRaised className="inline mr-2" /> },
};

const actividades = Object.keys(METs);
const intensidades = ["Baja", "Moderada", "Alta"];

export default function WorkoutContent() {
  const { data: session } = useSession();
  const [fecha, setFecha] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [duracion, setDuracion] = useState<number>(30);
  const [actividad, setActividad] = useState<string>(actividades[0]);
  const [intensidad, setIntensidad] = useState<string>("Moderada");
  const [pesoUsuario, setPesoUsuario] = useState<number>(70); // Valor por defecto, ideal: obtener de perfil
  const [calorias, setCalorias] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  type TimeFilter = '1w' | '15d' | '1m' | '3m' | '6m' | 'all';
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1w');

  useEffect(() => {
    calcularCalorias();
    // eslint-disable-next-line
  }, [actividad, intensidad, duracion, pesoUsuario]);

  useEffect(() => {
    fetchWorkouts();
    // eslint-disable-next-line
  }, []);

  // Obtener peso actual del usuario al montar
  useEffect(() => {
    async function fetchPeso() {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        if (data && data.weight) {
          setPesoUsuario(data.weight);
        }
      }
    }
    fetchPeso();
  }, []);

  function calcularCalorias() {
    const MET = METs[actividad][intensidad];
    if (typeof MET === 'number') {
      const cal = ((MET * pesoUsuario * duracion) / 60).toFixed(0);
      setCalorias(Number(cal));
    } else {
      setCalorias(0);
    }
  }

  async function fetchWorkouts() {
    setLoading(true);
    const res = await fetch("/api/user/workout");
    if (res.ok) {
      setWorkouts(await res.json());
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const res = await fetch("/api/user/workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha,
        duracion,
        actividad,
        intensidad,
        calorias,
      }),
    });
    if (res.ok) {
      setSuccess("¡Entrenamiento registrado exitosamente! 🎉");
      fetchWorkouts();
      // Clear form after successful submission
      setFecha(format(new Date(), "yyyy-MM-dd"));
      setDuracion(30);
      setActividad(actividades[0]);
      setIntensidad("Moderada");
    } else {
      setError("Error al guardar el entrenamiento. Intenta nuevamente.");
    }
    setLoading(false);
  }

  // Agrupar calorías por día para el gráfico
  type CaloriasPorDia = { [key: string]: number };
  const caloriasPorDia: CaloriasPorDia = workouts.reduce((acc: CaloriasPorDia, w: Workout) => {
    const dia = format(new Date(w.fecha), "yyyy-MM-dd");
    acc[dia] = (acc[dia] || 0) + w.calorias;
    return acc;
  }, {});
  const chartData = Object.entries(caloriasPorDia).map(([fecha, calorias]) => ({
    fecha,
    calorias,
  })).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Filtrar datos según el rango de tiempo seleccionado
  const now = startOfDay(new Date());
  let filterDate: Date;
  switch (timeFilter) {
    case '1w': filterDate = subDays(now, 7); break;
    case '15d': filterDate = subDays(now, 15); break;
    case '1m': filterDate = subMonths(now, 1); break;
    case '3m': filterDate = subMonths(now, 3); break;
    case '6m': filterDate = subMonths(now, 6); break;
    case 'all': default: filterDate = new Date(0); break;
  }
  const filteredChartData = chartData.filter(d => new Date(d.fecha) >= filterDate);

  return (
    <div className="w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Registro de Entrenamiento</h1>
        <p className="text-muted-foreground text-lg">Registra tu actividad física diaria y visualiza tu gasto calórico</p>
      </div>
      <form className="p-6 mb-8 w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Fecha</label>
            <input type="date" className="input w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" value={fecha} onChange={e => setFecha(e.target.value)} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Duración (minutos)</label>
            <input type="number" min={1} className="input w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" value={duracion} onChange={e => setDuracion(Number(e.target.value))} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Actividad</label>
            <div className="flex items-center gap-2">
              <span>{METs[actividad].icon}</span>
              <select
                className="input w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                value={actividad}
                onChange={e => setActividad(e.target.value)}
              >
                {actividades.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Intensidad</label>
            <select
              className="input w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              value={intensidad}
              onChange={e => setIntensidad(e.target.value)}
            >
              {intensidades.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Peso (kg)</label>
            <input type="number" min={1} className="input w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" value={pesoUsuario} onChange={e => setPesoUsuario(Number(e.target.value))} required />
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-lg font-semibold text-primary">🔥 Has gastado aproximadamente {calorias} cal en tu entrenamiento de hoy</span>
        </div>
        {error && (
          <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
            <span className="text-red-600 font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg mt-4">
            <span className="text-green-600 font-medium">{success}</span>
          </div>
        )}
        <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold transition-all shadow-lg mt-4 w-full sm:w-auto" disabled={loading}>
          {loading ? "Guardando..." : "Registrar entrenamiento"}
        </button>
      </form>
      <div className="p-6 mb-8 w-full">
        <h2 className="text-xl font-semibold text-foreground mb-6">Gráfico de calorías gastadas</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { key: '1w', label: '1 semana' },
            { key: '15d', label: '15 días' },
            { key: '1m', label: '1 mes' },
            { key: '3m', label: '3 meses' },
            { key: '6m', label: '6 meses' },
            { key: 'all', label: 'Todo' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeFilter(key as TimeFilter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                timeFilter === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredChartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="fecha" tickFormatter={d => format(new Date(d), "dd/MM", { locale: es })} />
              <YAxis 
                tickFormatter={v => `${v} cal`} 
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip formatter={v => `${v} cal`} labelFormatter={d => format(new Date(d), "EEEE, d 'de' MMMM", { locale: es })} />
              <Line type="monotone" dataKey="calorias" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="p-6 w-full">
        <h2 className="text-xl font-semibold text-foreground mb-6">Entrenamientos recientes</h2>
        {loading ? (
          <div className="text-center text-muted-foreground">Cargando...</div>
        ) : workouts.length === 0 ? (
          <div className="text-center text-muted-foreground">Aún no has registrado entrenamientos.</div>
        ) : (
          <div className="space-y-3 w-full">
            {workouts.map(w => (
              <div key={w.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-background/50 rounded-lg border border-border w-full">
                <div className="flex items-center gap-2">
                  {METs[w.actividad]?.icon}
                  <span className="font-semibold text-foreground">{w.actividad}</span>
                  <span className="text-xs text-muted-foreground ml-2">({w.intensidad})</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center mt-2 sm:mt-0">
                  <span className="text-sm text-muted-foreground">{format(new Date(w.fecha), "dd/MM/yyyy")}</span>
                  <span className="text-sm text-muted-foreground">{w.duracion} min</span>
                  <span className="text-primary font-bold">{w.calorias} cal</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-base text-muted-foreground">
          Cada entrenamiento que registras es un paso hacia tus objetivos de fitness. La consistencia es la clave del éxito, y cada sesión de ejercicio contribuye a mejorar tu salud física y mental. Recuerda que el progreso no siempre es lineal, pero cada esfuerzo cuenta en tu camino hacia una vida más saludable y activa.
        </div>
      </div>
    </div>
  );
} 