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
    include: { 
      userData: {
        include: {
          dailyWeights: {
            orderBy: { date: 'asc' }
          }
        }
      } 
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If userData doesn't exist yet, return empty profile data
  if (!user.userData) {
    return NextResponse.json({
      profileImage: "",
      weight: "",
      height: "",
      age: "",
      gender: "",
      activityLevel: "",
      dietType: "",
      preferences: "",
      goal: "",
      dailyWeights: [],
      name: user.name,
      email: user.email,
      image: user.image,
    });
  }

  return NextResponse.json({
    ...user.userData,
    name: user.name,
    email: user.email,
    image: user.image,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userData: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

  let updatedUserData;
  if (!user.userData) {
    // Crear UserData si no existe
    updatedUserData = await prisma.userData.create({
      data: {
        userId: user.id,
        weight: body.weight !== undefined && body.weight !== "" ? Number(body.weight) : 0,
        height: body.height !== undefined && body.height !== "" ? Number(body.height) : 0,
        age: body.age !== undefined && body.age !== "" ? Number(body.age) : 0,
        gender: body.gender || "",
        activityLevel: body.activityLevel || "",
        dietType: body.dietType || "",
        preferences: body.preferences || "",
        goal: body.goal !== undefined && body.goal !== "" ? String(body.goal) : "",
        profileImage: body.profileImage || "",
      },
    });
  } else {
    // Actualizar UserData existente
    updatedUserData = await prisma.userData.update({
      where: { id: user.userData.id },
      data: {
        weight: body.weight !== undefined && body.weight !== "" ? Number(body.weight) : user.userData.weight,
        height: body.height !== undefined && body.height !== "" ? Number(body.height) : user.userData.height,
        age: body.age !== undefined && body.age !== "" ? Number(body.age) : user.userData.age,
        gender: body.gender || user.userData.gender,
        activityLevel: body.activityLevel || user.userData.activityLevel,
        dietType: body.dietType || user.userData.dietType,
        preferences: body.preferences || user.userData.preferences,
        goal: body.goal !== undefined && body.goal !== "" ? String(body.goal) : user.userData.goal,
        profileImage: body.profileImage || user.userData.profileImage,
      },
    });
  }

  // Actualizar imagen de usuario (en tabla User)
  if (body.profileImage !== undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: { image: body.profileImage || null },
    });
  }

  return NextResponse.json({ success: true, userData: updatedUserData });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 