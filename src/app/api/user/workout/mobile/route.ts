import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper function to verify JWT token
async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Mobile workout GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyToken(req);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { fecha, duracion, actividad, intensidad, calorias } = body;

    if (!fecha || !duracion || !actividad || !intensidad || !calorias) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Adjust date to noon to avoid timezone issues
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
    console.error("Mobile workout POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 