import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/user/food?query=arroz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (query.length > 0) {
      const foods = await prisma.food.findMany({
        where: {
          nombre: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 10,
        orderBy: { nombre: "asc" },
      });
      return NextResponse.json(foods);
    } else {
      // Return all foods (limit 50)
      const foods = await prisma.food.findMany({
        take: 50,
        orderBy: { nombre: "asc" },
      });
      return NextResponse.json(foods);
    }
  } catch (error: any) {
    console.error("Error in food API:", error);
    return NextResponse.json({ error: "Error al buscar alimentos" }, { status: 500 });
  }
} 