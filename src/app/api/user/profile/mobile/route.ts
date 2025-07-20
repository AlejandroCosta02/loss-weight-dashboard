import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Verify JWT token and get user
async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return decoded as { email: string; iat: number; exp: number };
  } catch {
    return null;
  }
}

// GET - Get user profile (mobile endpoint)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
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
        id: "",
        userId: user.id,
        profileImage: "",
        weight: 0,
        height: 0,
        age: 0,
        gender: "",
        activityLevel: "",
        dietType: "",
        preferences: "",
        goal: "",
        theme: "aurora",
        onboardingCompleted: false,
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
  } catch (error) {
    console.error('Mobile profile GET error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update user profile (mobile endpoint)
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { userData: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUserData;
    if (!user.userData) {
      // Create UserData if it doesn't exist
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
      // Update existing UserData
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

    // Update user image (in User table)
    if (body.profileImage !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { image: body.profileImage || null },
      });
    }

    return NextResponse.json({ success: true, userData: updatedUserData });
  } catch (error) {
    console.error('Mobile profile PUT error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
