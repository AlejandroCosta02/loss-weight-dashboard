import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  const workouts = await prisma.workout.findMany({
    where: { userId: user.id },
    orderBy: { fecha: "desc" },
  });
  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  console.log("POST /api/user/workout called");
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    console.log("No session or email found");
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  console.log("Session found for:", session.user.email);
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    console.log("User not found in database");
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  console.log("User found:", user.id);
  const body = await req.json();
  console.log("Request body:", body);
  const { fecha, duracion, actividad, intensidad, calorias } = body;
  if (!fecha || !duracion || !actividad || !intensidad || !calorias) {
    console.log("Missing required fields:", { fecha, duracion, actividad, intensidad, calorias });
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }
  try {
    // Ajustar la fecha a mediodía para evitar desfase de zona horaria
    let fechaFinal: Date;
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      fechaFinal = new Date(fecha + 'T12:00:00');
    } else {
      fechaFinal = new Date(fecha);
    }
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        fecha: fechaFinal,
        duracion: Number(duracion),
        actividad,
        intensidad,
        calorias: Number(calorias),
      },
    });
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json({ error: "Error al guardar el entrenamiento" }, { status: 500 });
  }
} 