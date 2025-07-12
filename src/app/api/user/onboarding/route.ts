import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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

  return NextResponse.json({ onboardingCompleted: user.userData.onboardingCompleted });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Buscar el usuario y su UserData
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { userData: true },
  });
  if (!user || !user.userData) {
    return NextResponse.json({ error: "User data not found" }, { status: 404 });
  }

  // Marcar onboarding como completado
  await prisma.userData.update({
    where: { id: user.userData.id },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ success: true });
} 