import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const mealsByDay = meals.reduce((acc: any, meal) => {
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
    const result = Object.values(mealsByDay).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(result);
  }

  const where: any = { userId: user.id };
  if (fecha) {
    const date = new Date(fecha);
    where.fecha = {
      gte: new Date(date.setHours(0, 0, 0, 0)),
      lt: new Date(date.setHours(24, 0, 0, 0)),
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
    const { fecha, hora, tipoComida, alimentos, caloriasTotales } = body;
    
    if (!fecha || !hora || !tipoComida || !alimentos || alimentos.length === 0) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Validate and convert data types
    const validatedAlimentos = alimentos.map((a: any) => ({
      foodId: String(a.foodId),
      gramos: parseFloat(a.gramos),
      calorias: parseFloat(a.calorias),
    }));

    const meal = await prisma.meal.create({
      data: {
        userId: user.id,
        fecha: new Date(fecha),
        hora: String(hora),
        tipoComida: String(tipoComida),
        caloriasTotales: parseFloat(caloriasTotales),
        mealItems: {
          create: validatedAlimentos,
        },
      },
      include: {
        mealItems: { include: { food: true } },
      },
    });
    return NextResponse.json(meal);
  } catch (error: any) {
    console.error("Error creating meal:", error);
    return NextResponse.json({ 
      error: "Error al crear la comida", 
      details: error.message 
    }, { status: 500 });
  }
} 