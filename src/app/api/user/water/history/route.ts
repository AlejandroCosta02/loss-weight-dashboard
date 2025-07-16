import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Obtener todos los registros de agua del usuario, ordenados por fecha descendente
    const waterIntakes = await prisma.waterIntake.findMany({
      where: {
        userId: user.id
      },
      include: {
        registros: {
          orderBy: { hora: 'asc' }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    return NextResponse.json({ waterIntakes });
  } catch (error) {
    console.error("Error al obtener historial de agua:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
} 