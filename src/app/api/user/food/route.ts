import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Search foods by name
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const foods = await prisma.food.findMany({
      where: {
        nombre: {
          contains: query.trim(),
          mode: 'insensitive', // Case insensitive search
        },
      },
      orderBy: {
        nombre: 'asc',
      },
      take: 10, // Limit results
    });

    return NextResponse.json(foods);
  } catch (error: unknown) {
    console.error("Error searching foods:", error);
    return NextResponse.json({ error: "Error al buscar alimentos" }, { status: 500 });
  }
}

// POST: Create a new food (admin function)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nombre, calorias, proteinas, grasas, carbohidratos, gramosPorUnidad, unidad } = body;

    if (!nombre || calorias === undefined || proteinas === undefined || grasas === undefined || carbohidratos === undefined) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const food = await prisma.food.create({
      data: {
        nombre: String(nombre),
        calorias: parseFloat(calorias),
        proteinas: parseFloat(proteinas),
        grasas: parseFloat(grasas),
        carbohidratos: parseFloat(carbohidratos),
        gramosPorUnidad: gramosPorUnidad ? parseFloat(gramosPorUnidad) : null,
        unidad: String(unidad || "g"),
      },
    });

    return NextResponse.json(food);
  } catch (error: unknown) {
    console.error("Error creating food:", error);
    return NextResponse.json({ error: "Error al crear alimento" }, { status: 500 });
  }
} 