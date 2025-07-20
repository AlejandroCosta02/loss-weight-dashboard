import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userInfo, accessToken } = await req.json();

    if (!userInfo || !accessToken) {
      return NextResponse.json({ error: "User info and access token are required" }, { status: 400 });
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
      include: { userData: true },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.picture,
        },
        include: { userData: true },
      });
      console.log("Created new user:", user.email);
    } else {
      console.log("User already exists:", user.email);
    }

    // Create or get user data
    if (!user.userData) {
      await prisma.userData.create({
        data: {
          userId: user.id,
          profileImage: user.image || '',
          weight: 0,
          height: 0,
          age: 0,
          gender: 'other',
          activityLevel: 'moderate',
          dietType: 'balanced',
          goal: 'lose_weight',
        },
      });
    }

    // Generate a JWT token for mobile app
    const mobileToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token: mobileToken,
    });

  } catch (error) {
    console.error("Mobile auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
} 