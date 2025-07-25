import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MealData = {
  fecha: string;
  hora: string;
  tipoComida: string;
  caloriasTotales: number;
  alimentos: Array<{
    foodId: string;
    gramos: number;
    calorias: number;
  }>;
};

type DayMeals = {
  date: string;
  totalCalories: number;
  meals: Array<{
    id: string;
    fecha: Date;
    hora: string;
    tipoComida: string;
    caloriasTotales: number;
    mealItems: Array<{
      id: string;
      food: {
        id: string;
        nombre: string;
        calorias: number;
        proteinas: number;
        grasas: number;
        carbohidratos: number;
        gramosPorUnidad: number | null;
        unidad: string;
      };
      gramos: number;
      calorias: number;
    }>;
  }>;
};

// GET: List meals for the logged-in user (optionally by date)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get("fecha"); // optional, format: YYYY-MM-DD
  const groupByDay = searchParams.get("groupByDay") === "true";

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (groupByDay) {
    // Get meals grouped by day with total calories
    const meals = await prisma.meal.findMany({
      where: { userId: user.id },
      include: {
        mealItems: {
          include: { food: true },
        },
      },
      orderBy: { fecha: "desc" },
    });

    // Group meals by day
    const mealsByDay = meals.reduce((acc: Record<string, DayMeals>, meal) => {
      const dateKey = meal.fecha.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalCalories: 0,
          meals: []
        };
      }
      acc[dateKey].meals.push(meal);
      acc[dateKey].totalCalories += meal.caloriasTotales;
      return acc;
    }, {});

    // Convert to array and sort by date (newest first)
    const result = Object.values(mealsByDay).sort((a: DayMeals, b: DayMeals) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(result);
  }

  const where: { userId: string; fecha?: { gte: Date; lt: Date } } = { userId: user.id };
  if (fecha) {
    // Usar la misma lógica que el water API para consistencia
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, day, 0, 0, 0);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1);
    
    where.fecha = {
      gte: fechaInicio,
      lt: fechaFin,
    };
  }

  const meals = await prisma.meal.findMany({
    where,
    include: {
      mealItems: {
        include: { food: true },
      },
    },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(meals);
}

// POST: Create a new meal for the logged-in user
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  try {
    const body = await req.json();
    // Expect: { fecha, hora, tipoComida, alimentos: [{ foodId, gramos, calorias }], caloriasTotales }
    const { fecha, hora, tipoComida, alimentos, caloriasTotales }: MealData = body;
    
    if (!fecha || !hora || !tipoComida || !alimentos || alimentos.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Validate and convert data types
    const validatedAlimentos = alimentos.map((a) => ({
      foodId: String(a.foodId),
      gramos: parseFloat(String(a.gramos)),
      calorias: parseFloat(String(a.calorias)),
    }));

    // Usar la misma lógica de fecha que en el GET para consistencia
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaMeal = new Date(year, month - 1, day, 0, 0, 0);
    
    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        fecha: fechaMeal,
        hora: String(hora),
        tipoComida: String(tipoComida),
        caloriasTotales: parseFloat(String(caloriasTotales)),
        mealItems: {
          create: validatedAlimentos,
        },
      },
      include: {
        mealItems: { include: { food: true } },
      },
    });
    return NextResponse.json(meal);
  } catch (error: unknown) {
    console.error("Error creating meal:", error);
    return NextResponse.json({ 
      error: "Error al crear la comida", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 