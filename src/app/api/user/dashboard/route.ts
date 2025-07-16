import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DashboardData {
  profile: {
    weight: number;
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

// Función para calcular la recomendación de agua personalizada
function calcularAguaRecomendada(userData: {
  gender: string;
  age: number;
  weight: number;
  activityLevel: string;
}): number {
  const { gender, age, weight, activityLevel } = userData;
  
  let base = gender === "masculino" ? 3.0 : 2.2;
  
  if (age >= 50) base -= 0.2;
  if (activityLevel === "alta") base += 0.5;
  
  const aguaDiariaRecomendada = base + (weight * 0.01);
  return aguaDiariaRecomendada * 1000; // Convertir a mililitros
}

// Función para calcular calorías objetivo basado en perfil
function calcularCaloriasObjetivo(userData: {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
}): number {
  const { weight, height, age, gender, activityLevel, goal } = userData;
  
  // Fórmula básica de TMB (Tasa Metabólica Basal)
  let tmb;
  if (gender === "masculino") {
    tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Factor de actividad
  let factorActividad = 1.2; // sedentario
  if (activityLevel === "moderada") factorActividad = 1.375;
  else if (activityLevel === "alta") factorActividad = 1.55;
  
  let caloriasObjetivo = tmb * factorActividad;
  
  // Ajustar según objetivo
  if (goal === "perder") {
    caloriasObjetivo -= 500; // déficit de 500 calorías
  } else if (goal === "ganar") {
    caloriasObjetivo += 300; // superávit de 300 calorías
  }
  
  return Math.round(caloriasObjetivo);
}

// Función para calcular fecha estimada para alcanzar el peso objetivo
function calcularFechaObjetivo(userData: {
  weight: number;
  goal: string;
  age: number;
  gender: string;
  activityLevel: string;
}): string | null {
  const current = userData.weight;
  const goal = Number(userData.goal);
  
  if (!current || !goal || isNaN(current) || isNaN(goal) || current <= goal) return null;
  
  let base = 0.5;
  if (userData.gender === 'Masculino') base = 0.6;
  if (userData.gender === 'Femenino') base = 0.45;
  
  let ageAdj = 1;
  const age = userData.age;
  if (age >= 30 && age < 50) ageAdj = 0.9;
  if (age >= 50) ageAdj = 0.8;
  
  let actAdj = 1;
  if (userData.activityLevel === 'Sedentario') actAdj = 0.8;
  if (userData.activityLevel === 'Moderado') actAdj = 1;
  if (userData.activityLevel === 'Activo') actAdj = 1.1;
  if (userData.activityLevel === 'Muy activo') actAdj = 1.2;
  
  const rate = base * ageAdj * actAdj;
  if (!rate || rate <= 0) return null;
  
  const kgToLose = current - goal;
  const weeks = Math.ceil(kgToLose / rate);
  const now = new Date();
  now.setDate(now.getDate() + weeks * 7);
  
  return now.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        userData: {
          include: {
            dailyWeights: {
              orderBy: { date: 'desc' }
            }
          }
        } 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const today = new Date();
    // Usar la misma lógica que el water API para consistencia
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Obtener datos de hoy
    const todayMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        fecha: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });

    const todayWorkouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        fecha: {
          gte: todayStart,
          lt: todayEnd
        }
      }
    });

    const todayWater = await prisma.waterIntake.findFirst({
      where: {
        userId: user.id,
        fecha: todayStart
      }
    });

    // Calcular estadísticas de hoy
    const caloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.caloriasTotales, 0);
    const caloriesBurned = todayWorkouts.reduce((sum, workout) => sum + workout.calorias, 0);
    const waterConsumed = todayWater?.cantidadTotal || 0;
    const waterGoal = user.userData ? calcularAguaRecomendada(user.userData) : 2500;

    // Obtener peso de hoy - buscar el registro más reciente de hoy
    const todayWeight = user.userData?.dailyWeights.find(w => {
      const weightDate = new Date(w.date);
      const todayDate = new Date();
      
      // Comparar solo la fecha sin considerar la hora
      const weightDateStr = weightDate.toISOString().split('T')[0];
      const todayDateStr = todayDate.toISOString().split('T')[0];
      const isToday = weightDateStr === todayDateStr;
      

      
      return isToday;
    });



    // Obtener datos de la semana pasada para balance
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyMeals = await prisma.meal.findMany({
      where: {
        userId: user.id,
        fecha: {
          gte: weekAgo,
          lt: todayEnd
        }
      }
    });

    const weeklyWorkouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        fecha: {
          gte: weekAgo,
          lt: todayEnd
        }
      }
    });

    // Calcular calorías objetivo
    const caloriesGoal = user.userData ? calcularCaloriasObjetivo(user.userData) : 2000;

    // Crear datos de balance para la semana
    const balanceData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = weeklyMeals.filter(m => 
        m.fecha.toISOString().split('T')[0] === dateStr
      );
      const dayWorkouts = weeklyWorkouts.filter(w => 
        w.fecha.toISOString().split('T')[0] === dateStr
      );
      
      const dayCaloriesConsumed = dayMeals.reduce((sum, meal) => sum + meal.caloriasTotales, 0);
      const dayCaloriesBurned = dayWorkouts.reduce((sum, workout) => sum + workout.calorias, 0);
      const balance = dayCaloriesConsumed - caloriesGoal - dayCaloriesBurned;
      
      balanceData.push({
        date: dateStr,
        caloriesConsumed: dayCaloriesConsumed,
        caloriesBurned: dayCaloriesBurned,
        balance
      });
    }

    // Calcular estadísticas semanales
    const totalWeeklyCalories = weeklyMeals.reduce((sum, meal) => sum + meal.caloriasTotales, 0);
    const averageCalories = Math.round(totalWeeklyCalories / 7);

    const weeklyWater = await prisma.waterIntake.findMany({
      where: {
        userId: user.id,
        fecha: {
          gte: weekAgo,
          lt: todayEnd
        }
      }
    });

    const totalWeeklyWater = weeklyWater.reduce((sum: number, water: { cantidadTotal: number }) => sum + water.cantidadTotal, 0);
    const averageWater = Math.round(totalWeeklyWater / 7);

    const dashboardData: DashboardData = {
      profile: user.userData ? {
        weight: user.userData.weight,
        goal: user.userData.goal,
        age: user.userData.age,
        gender: user.userData.gender,
        activityLevel: user.userData.activityLevel,
        estimatedGoalDate: calcularFechaObjetivo({
          weight: user.userData.weight,
          goal: user.userData.goal,
          age: user.userData.age,
          gender: user.userData.gender,
          activityLevel: user.userData.activityLevel
        })
      } : null,
      todayStats: {
        caloriesConsumed,
        caloriesBurned,
        waterConsumed,
        waterGoal,
        weight: todayWeight?.weight || user.userData?.weight || null
      },
      weeklyStats: {
        averageCalories,
        averageWater,
        totalWorkouts: weeklyWorkouts.length,
        weightTrend: user.userData?.dailyWeights.map(w => w.weight) || []
      },
      balanceData
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error al obtener datos del dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
} 