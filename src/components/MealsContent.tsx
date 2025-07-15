"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MealsByDayContent from "./MealsByDayContent";

const TIPO_COMIDA = [
  { value: "desayuno", label: "Desayuno" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "cena", label: "Cena" },
  { value: "merienda", label: "Merienda" },
  { value: "snack", label: "Snack" },
];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

type Food = {
  id: string;
  nombre: string;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  gramosPorUnidad: number | null;
  unidad: string;
};

type Alimento = {
  food: Food | null;
  gramos: string;
  calorias: number;
  input: string;
  opciones: Food[];
  loading: boolean;
  esPorUnidad: boolean;
};

type MealItem = {
  id: string;
  food: Food;
  gramos: number;
  calorias: number;
};

type Meal = {
  id: string;
  fecha: string;
  hora: string;
  tipoComida: string;
  caloriasTotales: number;
  mealItems: MealItem[];
};

export default function MealsContent() {
  const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
  const [isVisible, setIsVisible] = useState(false);
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 5);
  });
  const [tipoComida, setTipoComida] = useState(TIPO_COMIDA[0].value);
  const [alimentos, setAlimentos] = useState<Alimento[]>([
    { food: null, gramos: "", calorias: 0, input: "", opciones: [], loading: false, esPorUnidad: false },
  ]);
  const [caloriasTotales, setCaloriasTotales] = useState(0);
  const [loading, setLoading] = useState(false);
  const [historialComidas, setHistorialComidas] = useState<Meal[]>([]);
  const [totalCaloriasDia, setTotalCaloriasDia] = useState(0);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  // Fade in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cargar historial de comidas del día
  const cargarHistorial = async () => {
    try {
      setLoadingHistorial(true);
      const res = await fetch(`/api/user/meal?fecha=${fecha}`);
      if (res.ok) {
        const comidas = await res.json();
        setHistorialComidas(comidas);
        
        // Calcular total de calorías del día
        const total = comidas.reduce((sum: number, comida: Meal) => sum + comida.caloriasTotales, 0);
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
  }, [fecha, cargarHistorial]);

  // Calcular calorías totales
  useEffect(() => {
    let total = 0;
    // Solo considerar alimentos agregados (excluir el primer elemento que es la búsqueda actual)
    for (let i = 1; i < alimentos.length; i++) {
      const a = alimentos[i];
      if (a.food && a.gramos) {
        total += a.calorias;
      }
    }
    setCaloriasTotales(total);
  }, [alimentos]);

  // Autocompletar alimentos
  const handleInput = async (idx: number, value: string) => {
    setAlimentos((prev) => prev.map((a, i) => i === idx ? { ...a, input: value, loading: true } : a));
    if (!value) {
      setAlimentos((prev) => prev.map((a, i) => i === idx ? { ...a, opciones: [], loading: false } : a));
      return;
    }
    try {
      const res = await fetch(`/api/user/food?query=${encodeURIComponent(value)}`);
      if (!res.ok) {
        throw new Error("Error al buscar alimentos");
      }
      const data: Food[] = await res.json();
      setAlimentos((prev) => prev.map((a, i) => i === idx ? { ...a, opciones: data, loading: false } : a));
    } catch (error: unknown) {
      console.error("Error searching foods:", error);
      setAlimentos((prev) => prev.map((a, i) => i === idx ? { ...a, opciones: [], loading: false } : a));
      toast.error("Error al buscar alimentos");
    }
  };

  // Seleccionar alimento
  const handleSelectFood = (idx: number, food: Food) => {
    const esPorUnidad = food.gramosPorUnidad !== null;
    console.log(`Debug selección: ${food.nombre}, gramosPorUnidad=${food.gramosPorUnidad}, esPorUnidad=${esPorUnidad}`);
    setAlimentos((prev) => prev.map((a, i) => i === idx ? { 
      ...a, 
      food, 
      input: food.nombre, 
      opciones: [], 
      esPorUnidad,
      calorias: 0 // No calcular calorías hasta que se ingrese la cantidad
    } : a));
  };

  // Cambiar gramos/cantidad
  const handleGramos = (idx: number, valor: string) => {
    setAlimentos((prev) => prev.map((a, i) => {
      if (i !== idx) return a;
      let calorias = 0;
      if (a.food && valor) {
        if (a.esPorUnidad && a.food.gramosPorUnidad) {
          // Convertir cantidad a gramos: cantidad × gramosPorUnidad
          const gramos = Number(valor) * a.food.gramosPorUnidad;
          calorias = Math.round((a.food.calorias * gramos) / 100);
          console.log(`Debug cebolla: cantidad=${valor}, gramosPorUnidad=${a.food.gramosPorUnidad}, gramos=${gramos}, calorias=${calorias}`);
        } else {
          // Directo en gramos
          calorias = Math.round((a.food.calorias * Number(valor)) / 100);
        }
      }
      return { ...a, gramos: valor, calorias };
    }));
  };

  // Eliminar alimento
  const removeAlimento = (idx: number) => {
    setAlimentos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Guardar comida
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (alimentos.filter((a, idx) => idx > 0).length === 0 || alimentos.filter((a, idx) => idx > 0).some(a => !a.food || !a.gramos)) {
      toast.error("Completa todos los alimentos y gramos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          hora,
          tipoComida,
          caloriasTotales,
          alimentos: alimentos.filter((a, idx) => idx > 0).map(a => {
            let gramosFinales = parseFloat(a.gramos) || 0;
            if (a.esPorUnidad && a.food?.gramosPorUnidad) {
              // Convertir cantidad a gramos
              gramosFinales = parseFloat(a.gramos) * a.food.gramosPorUnidad;
            }
            return { 
              foodId: a.food!.id, 
              gramos: gramosFinales, 
              calorias: a.calorias || 0 
            };
          }),
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
      toast.success("¡Comida registrada! 🥗");
      setAlimentos([{ food: null, gramos: "", calorias: 0, input: "", opciones: [], loading: false, esPorUnidad: false }]);
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
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'add'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Agregar Comida
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Historial
          </button>
        </div>
      </div>

      {activeTab === 'add' ? (
        // Food Entry Form
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Registro de Comidas</h1>
            <p className="text-muted-foreground text-lg">Lleva un control de tu alimentación diaria</p>
          </div>
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
                <input type="date" className="input w-full" value={fecha} onChange={e => setFecha(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Hora</label>
                <input type="time" className="input w-full" value={hora} onChange={e => setHora(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tipo de comida</label>
                <select className="input w-full" value={tipoComida} onChange={e => setTipoComida(e.target.value)} required>
                  {TIPO_COMIDA.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Buscar y agregar alimentos</label>
              
              {/* Search Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar alimento..."
                    className="input w-full"
                    value={alimentos[0]?.input || ""}
                    onChange={(e) => handleInput(0, e.target.value)}
                  />
                  {alimentos[0]?.loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {alimentos[0]?.opciones.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {alimentos[0].opciones.map((food) => (
                        <button
                          key={food.id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                          onClick={() => handleSelectFood(0, food)}
                        >
                          <div className="font-medium">{food.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            {food.calorias} cal/100g • {food.proteinas}g proteína • {food.grasas}g grasa • {food.carbohidratos}g carbos
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  placeholder={alimentos[0]?.esPorUnidad ? "Cantidad" : "Gramos"}
                  className="input w-24"
                  value={alimentos[0]?.gramos || ""}
                  onChange={(e) => handleGramos(0, e.target.value)}
                  disabled={!alimentos[0]?.food}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (alimentos[0]?.food && alimentos[0]?.gramos) {
                      // Add the current food to the list and clear the search
                      setAlimentos(prev => [
                        { food: null, gramos: "", calorias: 0, input: "", opciones: [], loading: false, esPorUnidad: false },
                        ...prev.filter(a => a.food && a.gramos)
                      ]);
                    }
                  }}
                  disabled={!alimentos[0]?.food || !alimentos[0]?.gramos}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>

              {/* Added Foods List */}
              <div className="space-y-2">
                {alimentos.filter((a, idx) => idx > 0 && a.food && a.gramos).map((alimento, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{alimento.food!.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {alimento.esPorUnidad 
                          ? `${alimento.gramos} ${alimento.food!.unidad}` 
                          : `${alimento.gramos}g`
                        }
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-primary">
                        {alimento.calorias} cal
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAlimento(idx)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {alimentos.filter((a, idx) => idx > 0 && a.food && a.gramos).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Busca y agrega alimentos arriba para comenzar</p>
                </div>
              )}
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Total:</span>
                <span className="text-lg font-bold text-primary">{caloriasTotales} cal</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || caloriasTotales === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
            >
              {loading ? "Guardando..." : "Guardar Comida"}
            </button>
          </form>

          {/* Today's Meals Summary */}
          <div className="mt-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Comidas de hoy ({fecha})</h3>
            {loadingHistorial ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : historialComidas.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay comidas registradas para hoy</p>
            ) : (
              <div className="space-y-3">
                {historialComidas.map((comida) => (
                  <div key={comida.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-1">
                          {TIPO_COMIDA.find(t => t.value === comida.tipoComida)?.label || comida.tipoComida}
                        </span>
                        <p className="text-sm text-muted-foreground">{comida.hora}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{comida.caloriasTotales} cal</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {comida.mealItems.map((item) => `${item.food.nombre} (${item.gramos}g)`).join(", ")}
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">
                    Total del día: {totalCaloriasDia} cal
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom text to expand width */}
          <div className="text-center mt-12 text-muted-foreground text-sm">
            <p>Cada comida que registras es una elección que impacta tu bienestar. La nutrición consciente es tan importante como el ejercicio, y cada porción que seleccionás contribuye a tus metas físicas y emocionales. Recordá que alimentar tu cuerpo es también cuidar tu mente. Elegir bien, poco a poco, transforma tu salud de forma duradera.</p>
          </div>
        </div>
      ) : (
        // History View
        <MealsByDayContent />
      )}
    </div>
  );
} 