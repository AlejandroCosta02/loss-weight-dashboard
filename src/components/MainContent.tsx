"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LineChartMultiMetrics from "./LineChartMultiMetrics";

interface DashboardData {
  profile: {
    weight: number;
    height: number;
    goal: string;
    age: number;
    gender: string;
    activityLevel: string;
    estimatedGoalDate: string | null;
  } | null;
  todayStats: {
    caloriesConsumed: number;
    caloriesBurned: number;
    waterConsumed: number;
    waterGoal: number;
    weight: number | null;
  };
  weeklyStats: {
    averageCalories: number;
    averageWater: number;
    totalWorkouts: number;
    weightTrend: number[];
  };
  balanceData: {
    date: string;
    caloriesConsumed: number;
    caloriesBurned: number;
    balance: number;
  }[];
}

export default function MainContent() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartType, setChartType] = useState<'balance' | 'line'>('line');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const cargarDatos = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);



  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Actualizar datos automáticamente (deshabilitado)
  // useEffect(() => {
  //   if (!session?.user?.email) return;

  //   const interval = setInterval(() => {
  //     cargarDatos();
  //   }, 300000); // 5 minutos

  //   return () => clearInterval(interval);
  // }, [session?.user?.email, cargarDatos]);

  // Escuchar eventos de actualización de datos
  useEffect(() => {
    const handleDataUpdated = () => {
      cargarDatos();
    };

    window.addEventListener('waterDataUpdated', handleDataUpdated);
    window.addEventListener('mealDataUpdated', handleDataUpdated);
    window.addEventListener('workoutDataUpdated', handleDataUpdated);

    return () => {
      window.removeEventListener('waterDataUpdated', handleDataUpdated);
      window.removeEventListener('mealDataUpdated', handleDataUpdated);
      window.removeEventListener('workoutDataUpdated', handleDataUpdated);
    };
  }, [cargarDatos]);

  // Formatear cantidad en formato legible
  const formatearCantidad = (ml: number): string => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)} L`;
    }
    return `${ml} ml`;
  };

  // Calcular porcentaje de progreso
  const calcularProgreso = (actual: number, objetivo: number): number => {
    if (objetivo === 0) return 0;
    return Math.min((actual / objetivo) * 100, 100);
  };

  // Obtener color de la barra de progreso
  const obtenerColorProgreso = (progreso: number): string => {
    if (progreso >= 100) return "bg-green-500";
    if (progreso >= 75) return "bg-blue-500";
    if (progreso >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Preparar datos para el gráfico de balance
  const prepararDatosGrafico = () => {
    if (!dashboardData) return [];
    
    console.log('Balance data received:', dashboardData.balanceData);
    
    return dashboardData.balanceData.map(item => {
      // Parse the date string directly to avoid timezone issues
      const [year, month, day] = item.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const monthDay = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      
      console.log(`Processing date: ${item.date} -> ${dayOfWeek} ${monthDay}`);
      
      return {
        fecha: `${dayOfWeek}\n${monthDay}`,
        balance: item.balance,
        consumidas: item.caloriesConsumed,
        quemadas: item.caloriesBurned
      };
    });
  };

  // Calcular calorías objetivo basado en el perfil
  const calcularCaloriasObjetivo = (profile: DashboardData['profile']): number => {
    if (!profile) return 2000;
    
    // Usar la fórmula de Mifflin-St Jeor (más precisa)
    // BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5 (male) or -161 (female)
    
    let bmr = 0;
    if (profile.gender === 'Masculino') {
      bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    } else {
      bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
    }
    
    // Factor de actividad
    const activityMultipliers = {
      'sedentario': 1.2,      // Poco o ningún ejercicio
      'ligero': 1.375,        // Ejercicio ligero 1-3 días/semana
      'moderado': 1.55,       // Ejercicio moderado 3-5 días/semana
      'activo': 1.725,        // Ejercicio intenso 6-7 días/semana
      'muy_activo': 1.9       // Ejercicio muy intenso, trabajo físico
    };
    
    const tdee = bmr * (activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2);
    
    // Para pérdida de peso, crear un déficit de 500-750 calorías
    // Esto resulta en una pérdida de 0.5-1 kg por semana
    const deficit = Math.min(750, Math.max(500, tdee * 0.2)); // 20% máximo, mínimo 500 cal
    
    const targetCalories = Math.round(tdee - deficit);
    
    // Asegurar que no sea demasiado bajo (mínimo 1200 para mujeres, 1500 para hombres)
    const minCalories = profile.gender === 'Masculino' ? 1500 : 1200;
    
    return Math.max(targetCalories, minCalories);
  };

  // Obtener mensaje motivacional basado en el balance
  const obtenerMensajeMotivacional = (): string => {
    if (!dashboardData) return "¡Comienza tu día con energía! 💪";
    
    const todayBalance = dashboardData.balanceData[dashboardData.balanceData.length - 1];
    if (!todayBalance) return "¡Comienza tu día con energía! 💪";
    
    if (todayBalance.balance < -200) return "¡Excelente! Estás en un buen déficit calórico 🎯";
    if (todayBalance.balance < 0) return "¡Muy bien! Mantienes un déficit saludable 💪";
    if (todayBalance.balance < 200) return "¡Cuidado! Estás cerca del límite ⚠️";
    return "¡Atención! Considera reducir las calorías hoy 📊";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Dashboard Principal
          </h1>
          <button
            onClick={() => cargarDatos()}
            disabled={isLoading}
            className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            title="Actualizar datos"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <p className="text-muted-foreground text-lg">
          Resumen completo de tu progreso y balance diario
        </p>
        {isLoading && (
          <div className="mt-2 text-sm text-primary">
            Actualizando datos...
          </div>
        )}
      </div>

      {dashboardData && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Calorías Consumidas */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Calorías Consumidas</h3>
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboardData.todayStats.caloriesConsumed}
              </div>
              <div className="text-sm text-muted-foreground">
                Hoy
              </div>
              {dashboardData.todayStats.caloriesConsumed > 0 && (
                <div className="mt-2 text-xs text-green-500">
                  ✓ Datos actualizados
                </div>
              )}
            </div>

            {/* Calorías Quemadas */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Calorías Quemadas</h3>
                <span className="text-2xl">💪</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboardData.todayStats.caloriesBurned}
              </div>
              <div className="text-sm text-muted-foreground">
                Ejercicio
              </div>
              {dashboardData.todayStats.caloriesBurned > 0 && (
                <div className="mt-2 text-xs text-green-500">
                  ✓ Datos actualizados
                </div>
              )}
            </div>

            {/* Agua Consumida */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Agua Consumida</h3>
                <span className="text-2xl">💧</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatearCantidad(dashboardData.todayStats.waterConsumed)}
              </div>
              <div className="text-sm text-muted-foreground">
                de {formatearCantidad(dashboardData.todayStats.waterGoal)}
              </div>
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${obtenerColorProgreso(calcularProgreso(dashboardData.todayStats.waterConsumed, dashboardData.todayStats.waterGoal))}`}
                    style={{ width: `${calcularProgreso(dashboardData.todayStats.waterConsumed, dashboardData.todayStats.waterGoal)}%` }}
                  />
                </div>
              </div>
              {dashboardData.todayStats.waterConsumed > 0 && (
                <div className="mt-2 text-xs text-green-500">
                  ✓ Datos actualizados
                </div>
              )}
            </div>

            {/* Peso Actual */}
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Peso Actual</h3>
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboardData.todayStats.weight ? `${dashboardData.todayStats.weight} kg` : 'No registrado'}
              </div>
              <div className="text-sm text-muted-foreground">
                Hoy
              </div>
            </div>
          </div>

          {/* Gráfico de Balance Diario */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Balance Calórico Semanal
              </h2>
              <div className="flex items-center gap-2">
                {/* Chart type toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setChartType('balance')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      chartType === 'balance'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Balance
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      chartType === 'line'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Líneas
                  </button>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </div>
            
            {/* Chart content */}
            {chartType === 'balance' && (
              <>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepararDatosGrafico()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        tick={({ x, y, payload }) => {
                          const text = payload.value;
                          const lines = text.split('\n');
                          return (
                            <g>
                              <text
                                x={x}
                                y={y}
                                dy={-8}
                                textAnchor="middle"
                                fontSize={12}
                                fontWeight={600}
                                fill="currentColor"
                              >
                                {lines[0]}
                              </text>
                              <text
                                x={x}
                                y={y}
                                dy={8}
                                textAnchor="middle"
                                fontSize={10}
                                fontWeight={400}
                                fill="currentColor"
                                opacity={0.7}
                              >
                                {lines[1]}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value} cal`, 
                          name === 'balance' ? 'Balance' : 
                          name === 'consumidas' ? 'Consumidas' : 'Quemadas'
                        ]}
                      />
                      <Bar 
                        dataKey="balance" 
                        fill="#8884d8" 
                        name="Balance"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Debug info */}
                <div className="mt-4 p-2 bg-muted rounded text-xs">
                  <strong>Debug:</strong> Chart data points: {prepararDatosGrafico().length}
                  <br />
                  Dates: {prepararDatosGrafico().map(d => d.fecha.replace('\n', ' ')).join(', ')}
                </div>
              </>
            )}
            
            {chartType === 'line' && (
              <>
                <LineChartMultiMetrics 
                  data={prepararDatosGrafico()} 
                  caloriesGoal={dashboardData.profile ? calcularCaloriasObjetivo(dashboardData.profile) : 2000}
                />
                
                {/* Debug info for calorie calculation */}
                {dashboardData.profile && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs">
                    <div className="font-semibold mb-2">📊 Cálculo de Calorías Objetivo:</div>
                                         <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>Peso: {dashboardData.profile.weight} kg</div>
                       <div>Edad: {dashboardData.profile.age} años</div>
                       <div>Género: {dashboardData.profile.gender}</div>
                       <div>Actividad: {dashboardData.profile.activityLevel}</div>
                       <div>Altura: {dashboardData.profile.height} cm</div>
                       <div>BMR calculado: {Math.round((10 * dashboardData.profile.weight) + (6.25 * dashboardData.profile.height) - (5 * dashboardData.profile.age) + (dashboardData.profile.gender === 'Masculino' ? 5 : -161))} cal</div>
                     </div>
                    <div className="mt-2 text-primary font-medium">
                      Objetivo diario: {calcularCaloriasObjetivo(dashboardData.profile)} cal
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-muted-foreground">
                {obtenerMensajeMotivacional()}
              </p>
            </div>
          </div>

          {/* Estadísticas Semanales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Promedio Calorías</h3>
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboardData.weeklyStats.averageCalories}
              </div>
              <div className="text-sm text-muted-foreground">
                Últimos 7 días
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Promedio Agua</h3>
                <span className="text-2xl">💧</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatearCantidad(dashboardData.weeklyStats.averageWater)}
              </div>
              <div className="text-sm text-muted-foreground">
                Últimos 7 días
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Entrenamientos</h3>
                <span className="text-2xl">🏃‍♂️</span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboardData.weeklyStats.totalWorkouts}
              </div>
              <div className="text-sm text-muted-foreground">
                Esta semana
              </div>
            </div>
          </div>

          {/* Información del Perfil */}
          {dashboardData.profile && (
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Tu Perfil
                </h2>
                <div className="text-2xl">👤</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Peso Actual</p>
                  <p className="text-lg font-semibold text-foreground">{dashboardData.profile.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Objetivo</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{dashboardData.profile.goal}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Edad</p>
                  <p className="text-lg font-semibold text-foreground">{dashboardData.profile.age} años</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Nivel de Actividad</p>
                  <p className="text-lg font-semibold text-foreground capitalize">{dashboardData.profile.activityLevel}</p>
                </div>
              </div>
              
              {/* Fecha Estimada */}
              {dashboardData.profile.estimatedGoalDate && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">🎯 Fecha Estimada</h3>
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {new Date(dashboardData.profile.estimatedGoalDate).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fecha estimada para alcanzar tu peso objetivo basada en tu perfil y nivel de actividad
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Explicación de Cálculos */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                ¿Cómo se Calculan estos Datos?
              </h2>
              <div className="text-2xl">🧮</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">📊 Balance Calórico</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Fórmula:</strong> Calorías Consumidas - Calorías Objetivo - Calorías Quemadas<br/>
                    <strong>Objetivo:</strong> Basado en tu TMB (Tasa Metabólica Basal) y nivel de actividad
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">💧 Recomendación de Agua</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Base:</strong> 3.0L (hombres) / 2.2L (mujeres)<br/>
                    <strong>Ajustes:</strong> +0.5L si actividad alta, -0.2L si edad ≥50
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">🎯 Fecha Estimada</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Factores:</strong> Género, edad, nivel de actividad<br/>
                    <strong>Pérdida:</strong> 0.5-0.6kg/semana según tu perfil
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">📈 Datos Reales</h3>
                  <p className="text-sm text-muted-foreground">
                    Todos los cálculos se basan en los datos que registras diariamente en las secciones de Comidas, Ejercicios y Agua
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!dashboardData && !isLoading && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-12 border border-border shadow-sm text-center">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No hay datos disponibles
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Comienza a registrar tu progreso para ver tu dashboard personalizado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 