import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface WaterIntakeData {
  fecha: string;
  cantidad: number;
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

// GET - Obtener consumo de agua del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userData: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    
    if (!fecha) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }

    const fechaDate = new Date(fecha);
    const fechaInicio = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1);

    // Buscar o crear registro de agua para la fecha
    let waterIntake = await prisma.waterIntake.findFirst({
      where: {
        userId: user.id,
        fecha: {
          gte: fechaInicio,
          lt: fechaFin
        }
      },
      include: {
        registros: {
          orderBy: { hora: 'asc' }
        }
      }
    });

    // Si no existe, crear uno nuevo con la recomendación calculada
    if (!waterIntake && user.userData) {
      const objetivoEstimado = calcularAguaRecomendada(user.userData);
      
      waterIntake = await prisma.waterIntake.create({
        data: {
          userId: user.id,
          fecha: fechaInicio,
          cantidadTotal: 0,
          objetivoEstimado
        },
        include: {
          registros: {
            orderBy: { hora: 'asc' }
          }
        }
      });
    }

    return NextResponse.json({ waterIntake });
  } catch (error) {
    console.error("Error al obtener consumo de agua:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST - Agregar consumo de agua
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userData: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const body: WaterIntakeData = await request.json();
    const { fecha, cantidad } = body;

    if (!fecha || !cantidad || cantidad <= 0) {
      return NextResponse.json({ error: "Fecha y cantidad válidas requeridas" }, { status: 400 });
    }

    const fechaDate = new Date(fecha);
    const fechaInicio = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1);

    // Buscar registro existente o crear uno nuevo
    let waterIntake = await prisma.waterIntake.findFirst({
      where: {
        userId: user.id,
        fecha: {
          gte: fechaInicio,
          lt: fechaFin
        }
      }
    });

    if (!waterIntake) {
      const objetivoEstimado = user.userData ? calcularAguaRecomendada(user.userData) : 2500;
      
      waterIntake = await prisma.waterIntake.create({
        data: {
          userId: user.id,
          fecha: fechaInicio,
          cantidadTotal: 0,
          objetivoEstimado
        }
      });
    }

    // Crear registro de agua
    await prisma.waterRecord.create({
      data: {
        waterIntakeId: waterIntake.id,
        hora: new Date(),
        cantidad
      }
    });

    // Actualizar cantidad total
    const nuevaCantidadTotal = waterIntake.cantidadTotal + cantidad;
    
    const updatedWaterIntake = await prisma.waterIntake.update({
      where: { id: waterIntake.id },
      data: { cantidadTotal: nuevaCantidadTotal },
      include: {
        registros: {
          orderBy: { hora: 'asc' }
        }
      }
    });

    return NextResponse.json({ 
      waterIntake: updatedWaterIntake,
      message: "Consumo de agua registrado exitosamente" 
    });
  } catch (error) {
    console.error("Error al registrar consumo de agua:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
} 