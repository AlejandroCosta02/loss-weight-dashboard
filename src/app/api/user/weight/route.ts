import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener todos los registros de peso del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userData: true },
    });

    if (!user || !user.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    const dailyWeights = await prisma.dailyWeight.findMany({
      where: { userDataId: user.userData.id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(dailyWeights);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Agregar un nuevo registro de peso
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, weight } = body;

    if (!date || !weight) {
      return NextResponse.json({ error: "Date and weight are required" }, { status: 400 });
    }

    if (isNaN(weight) || weight < 30 || weight > 300) {
      return NextResponse.json({ error: "Weight must be between 30 and 300 kg" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userData: true },
    });

    if (!user || !user.userData) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // Verificar si ya existe un registro para esa fecha
    const existingEntry = await prisma.dailyWeight.findFirst({
      where: {
        userDataId: user.userData.id,
        date: new Date(date),
      },
    });

    if (existingEntry) {
      return NextResponse.json({ error: "Ya existe un registro para esta fecha" }, { status: 409 });
    }

    // Crear el nuevo registro
    const dailyWeight = await prisma.dailyWeight.create({
      data: {
        userDataId: user.userData.id,
        date: new Date(date),
        weight: Number(weight),
      },
    });

    // Actualizar el peso actual en UserData si es el registro más reciente
    const latestEntry = await prisma.dailyWeight.findFirst({
      where: { userDataId: user.userData.id },
      orderBy: { date: 'desc' },
    });

    if (latestEntry && latestEntry.id === dailyWeight.id) {
      await prisma.userData.update({
        where: { id: user.userData.id },
        data: { weight: Number(weight) },
      });
    }

    return NextResponse.json({ success: true, dailyWeight });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 