"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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

type DayMeals = {
  date: string;
  totalCalories: number;
  meals: Meal[];
};

const TIPO_COMIDA_LABELS: Record<string, string> = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  cena: "Cena",
  merienda: "Merienda",
  snack: "Snack",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  };
  return date.toLocaleDateString('es-ES', options);
}

function formatTime(timeString: string): string {
  return timeString;
}

export default function MealsByDayContent() {
  const { data: session } = useSession();
  const [mealsByDay, setMealsByDay] = useState<DayMeals[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Fade in effect
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load meals grouped by day
  const loadMealsByDay = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/meal?groupByDay=true');
      if (res.ok) {
        const data = await res.json();
        setMealsByDay(data);
      } else {
        toast.error("Error al cargar las comidas");
      }
    } catch (error) {
      console.error("Error loading meals:", error);
      toast.error("Error al cargar las comidas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadMealsByDay();
    }
  }, [session]);

  const toggleDay = (date: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const isExpanded = (date: string) => expandedDays.has(date);

  if (loading) {
    return (
      <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Historial de Comidas</h1>
          <p className="text-muted-foreground text-lg">Cargando tu historial...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Historial de Comidas</h1>
        <p className="text-muted-foreground text-lg">Revisa tus comidas organizadas por día</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {mealsByDay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay comidas registradas aún</p>
            <p className="text-muted-foreground">¡Comienza agregando tu primera comida!</p>
          </div>
        ) : (
          mealsByDay.map((dayData) => (
            <div key={dayData.date} className="bg-card border border-border rounded-lg shadow-sm">
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayData.date)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {isExpanded(dayData.date) ? (
                    <FaChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FaChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {formatDate(dayData.date)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dayData.meals.length} comida{dayData.meals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {dayData.totalCalories} cal
                  </p>
                  <p className="text-xs text-muted-foreground">Total del día</p>
                </div>
              </button>

              {/* Meals List */}
              {isExpanded(dayData.date) && (
                <div className="border-t border-border">
                  {dayData.meals.map((meal) => (
                    <div key={meal.id} className="p-4 border-b border-border last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                            {TIPO_COMIDA_LABELS[meal.tipoComida] || meal.tipoComida}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(meal.hora)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {meal.caloriasTotales} cal
                        </span>
                      </div>

                      {/* Meal Items */}
                      <div className="space-y-2">
                        {meal.mealItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-foreground font-medium">
                                {item.food.nombre}
                              </span>
                              <span className="text-muted-foreground">
                                ({item.gramos}g)
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {item.calorias} cal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 